import { parse } from 'yaml';
import type FieldTypeBuilder from './field-type-builder';
import { boolean, number, string } from './primitives.js';

/** Select a named components.schemas object and the exact properties to translate. */
export interface OpenAPIFieldSelection {
    schema: string;
    fields: readonly string[];
}

type Schema = { [key: string]: unknown };
type Check = (value: any) => boolean;
type Definition = FieldTypeBuilder<any>;

const annotations = [
    'title',
    'description',
    'format',
    'default',
    'example',
    'examples',
    'deprecated',
    'readOnly',
    'writeOnly',
    'externalDocs',
    'xml',
];
const scalarKeywords = new Set([
    ...annotations,
    'type',
    'nullable',
    'enum',
    'const',
    'minLength',
    'maxLength',
    'pattern',
    'minimum',
    'maximum',
    'exclusiveMinimum',
    'exclusiveMaximum',
    'multipleOf',
]);
const objectKeywords = new Set([
    ...annotations,
    'type',
    'properties',
    'required',
    'additionalProperties',
]);

function fail(context: string, message: string): never {
    throw new Error(`fieldsFromOpenAPI: ${context}: ${message}.`);
}

function asObject(value: unknown, context: string): Schema {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        fail(context, 'expected a schema object');
    }
    return value as Schema;
}

function own(value: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(value, key);
}

function checkKeywords(schema: Schema, allowed: Set<string>, context: string): void {
    for (const keyword of Object.keys(schema)) {
        if (!allowed.has(keyword) && !keyword.startsWith('x-')) {
            fail(context, `unsupported keyword ${keyword}`);
        }
    }
}

function resolveSchema(value: unknown, document: Schema, context: string): Schema {
    const visited = new Set<string>();
    let schema = asObject(value, context);
    while (own(schema, '$ref')) {
        const reference = schema.$ref;
        if (typeof reference !== 'string' || !reference.startsWith('#/')) {
            fail(context, 'only local JSON Pointer references are supported');
        }
        if (
            Object.keys(schema).some(function sibling(key) {
                return !['$ref', 'summary', 'description'].includes(key);
            })
        ) {
            fail(context, 'reference siblings other than summary and description are unsupported');
        }
        if (visited.has(reference)) fail(context, `cyclic reference ${reference}`);
        visited.add(reference);
        let pointer: string;
        try {
            pointer = decodeURIComponent(reference.slice(2));
        } catch {
            fail(context, `invalid reference ${reference}`);
        }
        let target: unknown = document;
        for (const encoded of pointer.split('/')) {
            if (/~(?![01])/u.test(encoded)) fail(context, `invalid reference ${reference}`);
            const key = encoded.replace(/~1/g, '/').replace(/~0/g, '~');
            const container = asObject(target, context);
            if (!own(container, key)) fail(context, `unresolved reference ${reference}`);
            target = container[key];
        }
        schema = asObject(target, context);
    }
    return schema;
}

function numericKeyword(schema: Schema, key: string, context: string): number | undefined {
    if (!own(schema, key)) return undefined;
    const value = schema[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        fail(context, `${key} must be a finite number`);
    }
    return value;
}

function stringChecks(schema: Schema, context: string): Check[] {
    const checks: Check[] = [];
    for (const key of ['minLength', 'maxLength']) {
        const length = numericKeyword(schema, key, context);
        if (length === undefined) continue;
        if (!Number.isSafeInteger(length) || length < 0)
            fail(context, `${key} must be a nonnegative integer`);
        checks.push(function checkLength(value) {
            const count = Array.from(value as string).length;
            return key === 'minLength' ? count >= length : count <= length;
        });
    }
    if (own(schema, 'pattern')) {
        if (typeof schema.pattern !== 'string') fail(context, 'pattern must be a string');
        let pattern: RegExp;
        try {
            pattern = new RegExp(schema.pattern, 'u');
        } catch {
            fail(context, 'pattern must be a valid Unicode regular expression');
        }
        checks.push(function matchesPattern(value) {
            return pattern.test(value);
        });
    }
    return checks;
}

// Compare decimal representations exactly instead of relying on floating-point division.
function decimalParts(value: number): [bigint, number] {
    const [coefficient, exponent = '0'] = value.toString().split('e');
    const fractionalDigits = coefficient.split('.')[1]?.length || 0;
    return [BigInt(coefficient.replace('.', '')), Number(exponent) - fractionalDigits];
}

function numberChecks(schema: Schema, version30: boolean, context: string): Check[] {
    const checks: Check[] = [];
    for (const side of ['Minimum', 'Maximum']) {
        const key = side.toLowerCase();
        const exclusiveKey = `exclusive${side}`;
        const inclusive = numericKeyword(schema, key, context);
        let exclusive: number | undefined;
        if (version30) {
            if (own(schema, exclusiveKey) && typeof schema[exclusiveKey] !== 'boolean') {
                fail(context, `${exclusiveKey} must be boolean in OpenAPI 3.0`);
            }
            if (schema[exclusiveKey] === true) {
                if (inclusive === undefined) fail(context, `${exclusiveKey} requires ${key}`);
                exclusive = inclusive;
            }
        } else {
            exclusive = numericKeyword(schema, exclusiveKey, context);
        }
        checks.push(function withinBounds(value) {
            if (side === 'Minimum') {
                return (
                    (inclusive === undefined || value >= inclusive) &&
                    (exclusive === undefined || value > exclusive)
                );
            }
            return (
                (inclusive === undefined || value <= inclusive) &&
                (exclusive === undefined || value < exclusive)
            );
        });
    }
    const multiple = numericKeyword(schema, 'multipleOf', context);
    if (multiple !== undefined) {
        if (multiple <= 0) fail(context, 'multipleOf must be positive');
        checks.push(function isMultiple(value) {
            const [numerator, numeratorScale] = decimalParts(value);
            const [divisor, divisorScale] = decimalParts(multiple);
            const scale = Math.min(numeratorScale, divisorScale);
            return (
                (numerator * 10n ** BigInt(numeratorScale - scale)) %
                    (divisor * 10n ** BigInt(divisorScale - scale)) ===
                0n
            );
        });
    }
    return checks;
}

function translateField(
    schema: Schema,
    required: boolean,
    version30: boolean,
    context: string
): Definition {
    checkKeywords(schema, scalarKeywords, context);
    let type = schema.type;
    let nullable = false;
    if (version30) {
        if (own(schema, 'nullable') && typeof schema.nullable !== 'boolean')
            fail(context, 'nullable must be boolean');
        nullable = schema.nullable === true;
    } else {
        if (own(schema, 'nullable')) fail(context, 'use a type union with null in OpenAPI 3.1');
        if (Array.isArray(type)) {
            if (type.length !== 2 || !type.includes('null') || new Set(type).size !== 2) {
                fail(context, 'only a scalar type union with null is supported');
            }
            type = type.find(function nonNull(member) {
                return member !== 'null';
            });
            nullable = true;
        }
    }
    let definition: Definition;
    let accepts: Check;
    switch (type) {
        case 'string':
            definition = string;
            accepts = function isString(value) {
                return typeof value === 'string';
            };
            break;
        case 'integer':
            definition = number;
            accepts = function isInteger(value) {
                return Number.isSafeInteger(value);
            };
            break;
        case 'number':
            definition = number;
            accepts = function isNumber(value) {
                return typeof value === 'number' && Number.isFinite(value);
            };
            break;
        case 'boolean':
            definition = boolean;
            accepts = function isBoolean(value) {
                return typeof value === 'boolean';
            };
            break;
        default:
            fail(context, `unsupported scalar type ${JSON.stringify(type)}`);
    }
    const textKeys = ['minLength', 'maxLength', 'pattern'];
    const numberKeys = ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf'];
    if (
        (type !== 'string' &&
            textKeys.some(function present(key) {
                return own(schema, key);
            })) ||
        (!['integer', 'number'].includes(type as string) &&
            numberKeys.some(function present(key) {
                return own(schema, key);
            }))
    ) {
        fail(context, 'constraint does not match the declared type');
    }
    const checks =
        type === 'string'
            ? stringChecks(schema, context)
            : ['integer', 'number'].includes(type as string)
              ? numberChecks(schema, version30, context)
              : [];
    const commonChecks: Check[] = [];
    const enumeration = schema.enum;
    if (own(schema, 'enum')) {
        if (
            !Array.isArray(enumeration) ||
            enumeration.length === 0 ||
            enumeration.some(function invalid(value) {
                return value === null ? !nullable : !accepts(value);
            }) ||
            new Set(enumeration).size !== enumeration.length
        ) {
            fail(context, 'enum must contain distinct values matching the declared type');
        }
        // Capture values instead of closing over the caller's mutable document.
        const values = enumeration.slice();
        definition = definition.options(
            values.map(function option(value) {
                return { value, text: String(value) };
            })
        );
        commonChecks.push(function inEnum(value) {
            return values.includes(value);
        });
    }
    if (own(schema, 'const')) {
        if (version30) fail(context, 'const requires OpenAPI 3.1');
        const constant = schema.const;
        if (constant === null ? !nullable : !accepts(constant))
            fail(context, 'const does not match the declared type');
        commonChecks.push(function equalsConstant(value) {
            return value === constant;
        });
    }
    if (own(schema, 'title')) {
        if (typeof schema.title !== 'string') fail(context, 'title must be a string');
        definition = definition.label(schema.title);
    }
    // required means property presence, not a nonempty value or non-null value.
    return definition.defaultValue(undefined).validator({
        name: `must match OpenAPI schema ${context}`,
        validate: function validateOpenAPI(value) {
            if (value === undefined) return !required;
            if (value === null) {
                return (
                    nullable &&
                    commonChecks.every(function checkNull(check) {
                        return check(value);
                    })
                );
            }
            return (
                accepts(value) &&
                [...checks, ...commonChecks].every(function checkValue(check) {
                    return check(value);
                })
            );
        },
    });
}

/** Translate selected scalar properties of an OpenAPI 3.0/3.1 component schema. */
export function fieldsFromOpenAPI(
    source: string | object,
    selection: OpenAPIFieldSelection
): { [field: string]: Definition } {
    if (
        !selection ||
        typeof selection.schema !== 'string' ||
        !selection.schema ||
        !Array.isArray(selection.fields) ||
        !selection.fields.length ||
        selection.fields.some(function invalid(name) {
            return typeof name !== 'string' || !name;
        }) ||
        new Set(selection.fields).size !== selection.fields.length
    ) {
        throw new TypeError(
            'fieldsFromOpenAPI requires a schema name and a nonempty array of distinct field names.'
        );
    }
    const document = asObject(typeof source === 'string' ? parse(source) : source, 'document');
    if (typeof document.openapi !== 'string' || !/^3\.[01]\.\d+$/u.test(document.openapi)) {
        fail('document', 'expected OpenAPI 3.0.x or 3.1.x');
    }
    if (own(document, 'jsonSchemaDialect'))
        fail('document', 'custom schema dialects are unsupported');
    const version30 = document.openapi.startsWith('3.0.');
    const schemas = asObject(
        asObject(document.components, 'components').schemas,
        'components.schemas'
    );
    if (!own(schemas, selection.schema)) fail(selection.schema, 'unknown component schema');
    const schema = resolveSchema(schemas[selection.schema], document, selection.schema);
    checkKeywords(schema, objectKeywords, selection.schema);
    if (schema.type !== 'object') fail(selection.schema, 'expected type object');
    if (own(schema, 'additionalProperties') && typeof schema.additionalProperties !== 'boolean') {
        fail(selection.schema, 'schema-valued additionalProperties is unsupported');
    }
    const properties = asObject(schema.properties, `${selection.schema}.properties`);
    const required = schema.required === undefined ? [] : schema.required;
    if (
        !Array.isArray(required) ||
        required.some(function invalid(name) {
            return typeof name !== 'string' || !own(properties, name);
        }) ||
        new Set(required).size !== required.length
    )
        fail(selection.schema, 'invalid required property list');
    return Object.fromEntries(
        selection.fields.map(function translate(name) {
            const context = `${selection.schema}.${name}`;
            if (!own(properties, name)) fail(context, 'unknown property');
            return [
                name,
                translateField(
                    resolveSchema(properties[name], document, context),
                    required.includes(name),
                    version30,
                    context
                ),
            ];
        })
    );
}
