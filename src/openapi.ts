import { parse } from 'yaml';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import type { ErrorObject } from 'ajv';
import type FieldTypeBuilder from './field-type-builder';
import { boolean, field, number, string } from './primitives.js';

/** Select component properties; references supply external documents without network access. */
export interface OpenAPIFieldSelection {
    schema: string;
    fields: readonly string[];
    references?: Readonly<{ [uri: string]: string | object }>;
    /** Standard format assertions are opt-in, preserving the original annotation behavior. */
    validateFormats?: boolean;
}

type Schema = { [key: string]: any };
type Definition = FieldTypeBuilder<any>;
const documentURI = 'https://fdl.invalid/openapi.json';
const dialects = new Set([
    'https://json-schema.org/draft/2020-12/schema',
    'https://spec.openapis.org/oas/3.1/dialect/base',
]);
const schemaMaps = new Set([
    'properties',
    'patternProperties',
    '$defs',
    'definitions',
    'dependentSchemas',
]);
const schemaArrays = new Set(['allOf', 'anyOf', 'oneOf', 'prefixItems']);
const schemaValues = new Set([
    'items',
    'contains',
    'additionalProperties',
    'unevaluatedProperties',
    'unevaluatedItems',
    'propertyNames',
    'not',
    'if',
    'then',
    'else',
    'contentSchema',
]);

function fail(context: string, message: string): never {
    throw new Error(`fieldsFromOpenAPI: ${context}: ${message}.`);
}

function own(value: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(value, key);
}

function asObject(value: unknown, context: string): Schema {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        fail(context, 'expected an object');
    return value as Schema;
}

function read(source: string | object, context: string): Schema {
    return asObject(typeof source === 'string' ? parse(source) : source, context);
}

function decimalParts(value: number): [bigint, number] {
    const [coefficient, exponent = '0'] = value.toString().split('e');
    return [
        BigInt(coefficient.replace('.', '')),
        Number(exponent) - (coefficient.split('.')[1]?.length || 0),
    ];
}

function isMultiple(multiple: number, value: number): boolean {
    if (!Number.isFinite(value)) return false;
    const [numerator, numeratorScale] = decimalParts(value);
    const [divisor, divisorScale] = decimalParts(multiple);
    const scale = Math.min(numeratorScale, divisorScale);
    return (
        (numerator * 10n ** BigInt(numeratorScale - scale)) %
            (divisor * 10n ** BigInt(divisorScale - scale)) ===
        0n
    );
}

/** Normalize schema positions only: never reinterpret defaults, examples, or enum data as schemas. */
function normalize(
    value: any,
    version30: boolean,
    context: string,
    active = new Set<object>()
): any {
    if (typeof value === 'boolean') return value;
    const input = asObject(value, context);
    if (active.has(input))
        fail(context, 'cyclic JavaScript object; use $ref for recursive schemas');
    active.add(input);
    const output: Schema = {};
    for (const [key, child] of Object.entries(input)) {
        if (key === '$async') fail(context, 'asynchronous schemas are unsupported');
        if (key.startsWith('x-') || key === 'nullable') continue;
        if (schemaMaps.has(key)) {
            output[key] = Object.fromEntries(
                Object.entries(asObject(child, `${context}.${key}`)).map(function entry([
                    name,
                    schema,
                ]) {
                    return [
                        name,
                        normalize(schema, version30, `${context}.${key}.${name}`, active),
                    ];
                })
            );
        } else if (schemaArrays.has(key)) {
            if (!Array.isArray(child)) fail(context, `${key} must be an array`);
            output[key] = child.map(function item(schema, index) {
                return normalize(schema, version30, `${context}.${key}[${index}]`, active);
            });
        } else if (schemaValues.has(key)) {
            output[key] = normalize(child, version30, `${context}.${key}`, active);
        } else if ((key === '$ref' || key === '$dynamicRef') && typeof child === 'string') {
            output[key] = child.replace('#/components/schemas/', '#/$defs/');
        } else {
            // Clone annotations and literal data too, so callers retain ownership.
            output[key] = JSON.parse(JSON.stringify(child));
        }
    }
    active.delete(input);
    if (own(input, 'nullable')) {
        if (!version30) fail(context, 'use a type union with null in OpenAPI 3.1 or 3.2');
        if (typeof input.nullable !== 'boolean') fail(context, 'nullable must be boolean');
        if (input.nullable) {
            if (typeof input.type !== 'string') fail(context, 'nullable requires an explicit type');
            output.type = [input.type, 'null'];
        }
    }
    if (version30) {
        if (Array.isArray(input.type)) fail(context, 'type arrays require OpenAPI 3.1 or 3.2');
        if (own(input, 'const')) fail(context, 'const requires OpenAPI 3.1 or 3.2');
        for (const side of ['Minimum', 'Maximum']) {
            const key = `exclusive${side}`;
            if (!own(input, key)) continue;
            if (typeof input[key] !== 'boolean')
                fail(context, `${key} must be boolean in OpenAPI 3.0`);
            delete output[key];
            if (input[key]) {
                const inclusive = side.toLowerCase();
                if (typeof input[inclusive] !== 'number')
                    fail(context, `${key} requires ${inclusive}`);
                output[key] = input[inclusive];
                delete output[inclusive];
            }
        }
        // OpenAPI 3.0 Reference Objects ignore siblings; preserve that version's meaning.
        if (own(input, '$ref')) return { $ref: output.$ref };
    }
    if (own(output, '$schema')) {
        if (!dialects.has(output.$schema))
            fail(context, `unsupported schema dialect ${output.$schema}`);
        output.$schema = 'https://json-schema.org/draft/2020-12/schema';
    }
    if (
        input.type === 'integer' ||
        (Array.isArray(input.type) &&
            input.type.includes('integer') &&
            !input.type.includes('number'))
    ) {
        output.fdlSafeInteger = true;
    }
    if (Array.isArray(output.enum) && output.enum.length === 0) return false;
    return output;
}

function resource(source: string | object, context: string): Schema {
    const document = read(source, context);
    if (!own(document, 'openapi')) return normalize(document, false, context);
    if (typeof document.openapi !== 'string' || !/^3\.[012]\.\d+$/u.test(document.openapi))
        fail(context, 'expected OpenAPI 3.0.x, 3.1.x, or 3.2.x');
    if (document.jsonSchemaDialect !== undefined && !dialects.has(document.jsonSchemaDialect))
        fail(context, 'unsupported schema dialect');
    const schemas = asObject(
        asObject(document.components, 'components').schemas,
        'components.schemas'
    );
    const definitions = Object.fromEntries(
        Object.entries(schemas).map(function entry([name, schema]) {
            return [name, normalize(schema, document.openapi.startsWith('3.0.'), name)];
        })
    );
    // Use real JSON Schema locations; normalization rewrites OpenAPI component pointers.
    return { $defs: definitions };
}

function pointer(
    reference: string,
    resources: Map<string, Schema>,
    context: string
): { schema: any; base: string } {
    const direct = resources.get(reference);
    if (direct) return { schema: direct, base: reference.split('#')[0] };
    const url = new URL(reference);
    const fragment = url.hash;
    url.hash = '';
    let schema: any = resources.get(url.href);
    if (!schema) fail(context, `external reference ${url.href} must be supplied in references`);
    if (fragment && fragment !== '#') {
        if (!fragment.startsWith('#/'))
            fail(context, 'named anchors are validated but cannot supply field metadata');
        let decoded: string;
        try {
            decoded = decodeURIComponent(fragment.slice(2));
        } catch {
            fail(context, 'invalid reference');
        }
        for (const encoded of decoded.split('/')) {
            if (/~(?![01])/u.test(encoded)) fail(context, 'invalid JSON Pointer escape');
            const key = encoded.replace(/~1/g, '/').replace(/~0/g, '~');
            if (!schema || typeof schema !== 'object' || !own(schema, key))
                fail(context, `unresolved reference ${reference}`);
            schema = schema[key];
        }
    }
    return { schema, base: url.href };
}

function indexSchemas(
    schema: any,
    base: string,
    locations: Map<string, Schema>,
    bases: WeakMap<object, string>,
    visited = new Set<object>()
): void {
    if (typeof schema === 'boolean' || visited.has(schema)) return;
    visited.add(schema);
    if (schema.$id) {
        base = new URL(schema.$id, base).href;
        schema.$id = base;
        if (locations.has(base) && locations.get(base) !== schema)
            fail(base, 'duplicate schema identifier');
        locations.set(base, schema);
    }
    bases.set(schema, base);
    for (const keyword of ['$anchor', '$dynamicAnchor']) {
        if (schema[keyword]) locations.set(new URL(`#${schema[keyword]}`, base).href, schema);
    }
    for (const key of schemaMaps) {
        if (schema[key])
            for (const child of Object.values(schema[key]))
                indexSchemas(child, base, locations, bases, visited);
    }
    for (const key of schemaArrays) {
        if (schema[key])
            for (const child of schema[key]) indexSchemas(child, base, locations, bases, visited);
    }
    for (const key of schemaValues) {
        if (schema[key] !== undefined) indexSchemas(schema[key], base, locations, bases, visited);
    }
}

function checkReferences(
    schema: any,
    base: string,
    resources: Map<string, Schema>,
    visited = new Set<object>()
): void {
    if (typeof schema === 'boolean' || visited.has(schema)) return;
    visited.add(schema);
    if (schema.$id) base = new URL(schema.$id, base).href;
    if (schema.$ref || schema.$dynamicRef) {
        const reference = new URL(schema.$ref || schema.$dynamicRef, base).href;
        const resolved = pointer(reference, resources, base);
        checkReferences(resolved.schema, resolved.base, resources, visited);
    }
    for (const key of schemaMaps) {
        if (schema[key])
            for (const child of Object.values(schema[key]))
                checkReferences(child, base, resources, visited);
    }
    for (const key of schemaArrays) {
        if (schema[key])
            for (const child of schema[key]) checkReferences(child, base, resources, visited);
    }
    for (const key of schemaValues) {
        if (schema[key] !== undefined) checkReferences(schema[key], base, resources, visited);
    }
}

function propertySchemas(
    schema: any,
    name: string,
    base: string,
    resources: Map<string, Schema>,
    visited = new Set<any>()
): any[] {
    if (typeof schema === 'boolean') return [];
    if (visited.has(schema)) return [];
    visited.add(schema);
    const result: any[] = [];
    if (schema.$id) base = new URL(schema.$id, base).href;
    if (schema.$ref || schema.$dynamicRef) {
        const resolved = pointer(
            new URL(schema.$ref || schema.$dynamicRef, base).href,
            resources,
            name
        );
        result.push(...propertySchemas(resolved.schema, name, resolved.base, resources, visited));
    }
    const declared = schema.properties && own(schema.properties, name);
    if (declared) result.push(schema.properties[name]);
    let matched = false;
    for (const [pattern, property] of Object.entries(schema.patternProperties || {})) {
        if (new RegExp(pattern, 'u').test(name)) {
            matched = true;
            result.push(property);
        }
    }
    if (!declared && !matched && schema.additionalProperties)
        result.push(schema.additionalProperties);
    for (const keyword of ['allOf', 'anyOf', 'oneOf', 'then', 'else']) {
        const branches = Array.isArray(schema[keyword])
            ? schema[keyword]
            : schema[keyword]
              ? [schema[keyword]]
              : [];
        for (const branch of branches)
            result.push(...propertySchemas(branch, name, base, resources, visited));
    }
    return result;
}

// Inspect renderer metadata independently; validation retains the original composition.
function definitionHints(
    schema: any,
    resources: Map<string, Schema>,
    bases: WeakMap<object, string>,
    visited = new Set<object>()
): Schema[] {
    if (typeof schema === 'boolean' || visited.has(schema)) return [];
    visited.add(schema);
    const base = bases.get(schema) || documentURI;
    const hints: Schema[] = [];
    if (schema.type || schema.enum || schema.title) hints.push(schema);
    if (schema.$ref || schema.$dynamicRef) {
        const resolved = pointer(
            new URL(schema.$ref || schema.$dynamicRef, base).href,
            resources,
            'field metadata'
        );
        hints.push(...definitionHints(resolved.schema, resources, bases, visited));
    }
    for (const keyword of ['allOf', 'anyOf', 'oneOf']) {
        for (const branch of schema[keyword] || [])
            hints.push(...definitionHints(branch, resources, bases, visited));
    }
    return hints;
}

function hasAlternatives(
    schema: any,
    resources: Map<string, Schema>,
    bases: WeakMap<object, string>,
    visited = new Set<object>()
): boolean {
    if (typeof schema === 'boolean' || visited.has(schema)) return false;
    visited.add(schema);
    if (
        schema.anyOf ||
        schema.oneOf ||
        schema.if ||
        schema.then ||
        schema.else ||
        schema.dependentSchemas
    )
        return true;
    if (schema.$ref || schema.$dynamicRef) {
        const base = bases.get(schema) || documentURI;
        const resolved = pointer(
            new URL(schema.$ref || schema.$dynamicRef, base).href,
            resources,
            'field metadata'
        );
        if (hasAlternatives(resolved.schema, resources, bases, visited)) return true;
    }
    return (schema.allOf || []).some(function branch(child: any) {
        return hasAlternatives(child, resources, bases, visited);
    });
}

function primitiveType(schema: Schema): string | undefined {
    if (!Array.isArray(schema.type))
        return typeof schema.type === 'string' ? schema.type : undefined;
    const types = schema.type.filter(function nonNull(type: string) {
        return type !== 'null';
    });
    return types.length === 1 ? types[0] : undefined;
}

function acyclic(value: unknown, active = new Set<object>()): boolean {
    if (!value || typeof value !== 'object') return true;
    if (active.has(value)) return false;
    active.add(value);
    const valid = Object.values(value).every(function child(item) {
        return acyclic(item, active);
    });
    active.delete(value);
    return valid;
}

function affectsField(error: ErrorObject, name: string): boolean {
    const first = error.instancePath.split('/')[1]?.replace(/~1/g, '/').replace(/~0/g, '~');
    // Root-level errors are shared constraints, including missing required siblings.
    return first === undefined || first === name;
}

/** Translate OpenAPI schemas without flattening structured values or weakening composed rules. */
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
    if (selection.validateFormats !== undefined && typeof selection.validateFormats !== 'boolean') {
        throw new TypeError('fieldsFromOpenAPI: validateFormats must be boolean.');
    }
    if (selection.references !== undefined) asObject(selection.references, 'references');
    const resources = new Map<string, Schema>([[documentURI, resource(source, 'document')]]);
    for (const [uri, document] of Object.entries(selection.references || {})) {
        const absolute = new URL(uri, documentURI).href;
        if (absolute === documentURI) fail('references', 'cannot replace the primary document');
        resources.set(absolute, resource(document, uri));
    }
    const schemas = resources.get(documentURI)!.$defs;
    if (!schemas || !own(schemas, selection.schema))
        fail(selection.schema, 'unknown component schema');
    const ajv = new Ajv2020({
        allErrors: true,
        strictSchema: true,
        strictTypes: false,
        strictTuples: false,
        strictRequired: false,
        allowUnionTypes: true,
        validateFormats: selection.validateFormats === true,
        ownProperties: true,
    });
    addFormats(ajv);
    for (const keyword of [
        'example',
        'externalDocs',
        'xml',
        'discriminator',
        '$anchor',
        'summary',
    ]) {
        if (!ajv.getKeyword(keyword)) ajv.addKeyword({ keyword, valid: true });
    }
    ajv.addKeyword({
        keyword: 'fdlSafeInteger',
        type: 'number',
        schemaType: 'boolean',
        validate: function safe(_schema: boolean, value: number) {
            return !Number.isInteger(value) || Number.isSafeInteger(value);
        },
    });
    ajv.removeKeyword('multipleOf');
    ajv.addKeyword({
        keyword: 'multipleOf',
        type: 'number',
        schemaType: 'number',
        metaSchema: { type: 'number', exclusiveMinimum: 0 },
        validate: isMultiple,
    });
    const locations = new Map(resources);
    const bases = new WeakMap<object, string>();
    for (const [uri, schema] of resources) indexSchemas(schema, uri, locations, bases);
    for (const [uri, schema] of resources) {
        try {
            ajv.addSchema(schema, uri);
        } catch (error) {
            fail(selection.schema, error instanceof Error ? error.message : String(error));
        }
    }
    checkReferences(schemas[selection.schema], documentURI, locations);
    const reference = `${documentURI}#/$defs/${selection.schema.replace(/~/g, '~0').replace(/\//g, '~1')}`;
    let validate: ReturnType<typeof ajv.compile>;
    try {
        validate = ajv.compile({ $ref: reference });
    } catch (error) {
        fail(selection.schema, error instanceof Error ? error.message : String(error));
    }
    const schema = schemas[selection.schema];
    return Object.fromEntries(
        selection.fields.map(function translate(name) {
            const hints = propertySchemas(schema, name, documentURI, locations);
            if (
                !hints.length &&
                schema !== true &&
                schema !== false &&
                !schema.additionalProperties &&
                !schema.patternProperties
            )
                fail(`${selection.schema}.${name}`, 'unknown property');
            const metadata = hints.flatMap(function resolveHint(hint) {
                return definitionHints(hint, locations, bases);
            });
            const hint =
                metadata.find(function objectHint(value) {
                    return value && typeof value === 'object';
                }) || {};
            const types = metadata
                .map(primitiveType)
                .filter(function present(type): type is string {
                    return type !== undefined;
                });
            let definition: Definition =
                types.length &&
                types.every(function same(type) {
                    return type === 'string';
                })
                    ? string
                    : types.length &&
                        types.every(function same(type) {
                            return type === 'integer' || type === 'number';
                        })
                      ? number
                      : types.length &&
                          types.every(function same(type) {
                              return type === 'boolean';
                          })
                        ? boolean
                        : field;
            if (hint.title) definition = definition.label(hint.title);
            // Only direct scalar enums have unambiguous choices across schema alternatives.
            if (
                !hasAlternatives(schema, locations, bases) &&
                !hints.some(function alternatives(hint) {
                    return hasAlternatives(hint, locations, bases);
                }) &&
                metadata.length === 1 &&
                Array.isArray(hint.enum) &&
                hint.enum.every(function scalar(value: any) {
                    return value === null || ['string', 'number', 'boolean'].includes(typeof value);
                })
            ) {
                definition = definition.options(
                    hint.enum.map(function option(value: any) {
                        return { value, text: String(value) };
                    })
                );
            }
            return [
                name,
                definition.defaultValue(undefined).validator({
                    name: `must match OpenAPI schema ${selection.schema}.${name}`,
                    validate: function validateOpenAPI(value, _view, record) {
                        const values = Object.fromEntries(
                            Object.entries(record?.values || {}).filter(function present([
                                _key,
                                stored,
                            ]) {
                                return stored !== undefined;
                            })
                        );
                        if (value === undefined) delete values[name];
                        else
                            Object.defineProperty(values, name, {
                                value,
                                enumerable: true,
                                configurable: true,
                                writable: true,
                            });
                        if (!acyclic(values)) return false;
                        if (validate(values)) return true;
                        return !(validate.errors || []).some(function relevant(error) {
                            return affectsField(error, name);
                        });
                    },
                }),
            ];
        })
    );
}
