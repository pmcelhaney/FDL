import { parsePrismaSchema } from '@loancrate/prisma-schema-parser/dist/parse';
import type {
    EnumDeclaration,
    FieldDeclaration,
    ModelDeclaration,
    SchemaAttribute,
    BlockAttribute,
} from '@loancrate/prisma-schema-parser/dist/ast';
import FieldTypeBuilder from './field-type-builder';
import { boolean, date, number, string } from './primitives.js';

/** Select a model and the exact fields to translate; no fields are inferred or omitted. */
export interface PrismaFieldSelection {
    model: string;
    fields: readonly string[];
}

type Definition = FieldTypeBuilder<any>;
type ValueCheck = (value: unknown) => boolean;

const fieldAttributes = new Set(['id', 'unique', 'default', 'updatedAt', 'map']);
const modelAttributes = new Set(['id', 'unique', 'index', 'fulltext', 'map', 'schema']);

function checkAttributes(
    attributes: readonly SchemaAttribute[],
    allowed: Set<string>,
    context: string
): void {
    for (const attribute of attributes) {
        const name = attribute.path.value.join('.');
        if (!allowed.has(name)) {
            throw new Error(`fieldsFromPrisma: unsupported attribute ${name} on ${context}.`);
        }
    }
}

function isString(value: unknown): boolean {
    return typeof value === 'string';
}

function isInt(value: unknown): boolean {
    return (
        typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= -2147483648 &&
        value <= 2147483647
    );
}

function isFloat(value: unknown): boolean {
    return typeof value === 'number' && Number.isFinite(value);
}

function isBoolean(value: unknown): boolean {
    return typeof value === 'boolean';
}

function isDate(value: unknown): boolean {
    return value instanceof Date && Number.isFinite(value.getTime());
}

function translateField(
    field: FieldDeclaration,
    enums: Map<string, EnumDeclaration>,
    model: string
): Definition {
    const context = `${model}.${field.name.value}`;
    checkAttributes(field.attributes || [], fieldAttributes, context);
    const nullable = field.type.kind === 'optional';
    const type = field.type.kind === 'optional' ? field.type.type : field.type;
    if (type.kind !== 'typeId') {
        throw new Error(`fieldsFromPrisma: unsupported field type on ${context} (${type.kind}).`);
    }

    const typeName = type.name.value;
    let definition: Definition;
    let accepts: ValueCheck;
    switch (typeName) {
        case 'String':
            definition = string;
            accepts = isString;
            break;
        case 'Int':
            definition = number;
            accepts = isInt;
            break;
        case 'Float':
            definition = number;
            accepts = isFloat;
            break;
        case 'Boolean':
            definition = boolean;
            accepts = isBoolean;
            break;
        case 'DateTime':
            definition = date;
            accepts = isDate;
            break;
        default: {
            const enumeration = enums.get(typeName);
            if (!enumeration) {
                throw new Error(`fieldsFromPrisma: unsupported type ${typeName} on ${context}.`);
            }
            checkAttributes(
                enumeration.members.filter(function isAttribute(member): member is BlockAttribute {
                    return member.kind === 'blockAttribute';
                }),
                new Set(['map', 'schema']),
                `enum ${typeName}`
            );
            const values = enumeration.members.flatMap(function enumValues(member) {
                if (member.kind !== 'enumValue') return [];
                checkAttributes(
                    member.attributes || [],
                    new Set(['map']),
                    `${typeName}.${member.name.value}`
                );
                return [member.name.value];
            });
            if (values.length === 0 || new Set(values).size !== values.length) {
                throw new Error(`fieldsFromPrisma: enum ${typeName} must have distinct members.`);
            }
            definition = string.options(
                values.map(function option(value) {
                    return { value, text: value };
                })
            );
            accepts = function isEnumValue(value) {
                return typeof value === 'string' && values.includes(value);
            };
        }
    }

    // A database default is not a client-side factory. Remove primitive defaults
    // rather than inventing values such as 0, false, or today's date on clear().
    return definition.defaultValue(undefined).validator({
        name: `must match Prisma ${typeName}${nullable ? '?' : ''}`,
        validate: function validatePrismaValue(value) {
            return value === null ? nullable : accepts(value);
        },
    });
}

/**
 * Parse classic Prisma schema text and return ordinary, immutable FDL definitions.
 * Validates complete selected values, not Prisma create/update operation inputs.
 * Does not connect to a database or execute defaults, relations, or uniqueness checks.
 * Throws for invalid syntax, unknown selections, or unsupported selected declarations.
 */
export function fieldsFromPrisma(
    schema: string,
    selection: PrismaFieldSelection
): { [field: string]: Definition } {
    if (
        typeof schema !== 'string' ||
        !selection ||
        typeof selection.model !== 'string' ||
        !selection.model ||
        !Array.isArray(selection.fields) ||
        selection.fields.length === 0 ||
        selection.fields.some(function invalidName(name) {
            return typeof name !== 'string' || !name;
        })
    ) {
        throw new TypeError(
            'fieldsFromPrisma requires schema text, a model name, and a nonempty fields array.'
        );
    }
    if (new Set(selection.fields).size !== selection.fields.length) {
        throw new Error('fieldsFromPrisma: selected field names must be distinct.');
    }

    const parsed = parsePrismaSchema(schema);
    const models = parsed.declarations.filter(
        function isModel(declaration): declaration is ModelDeclaration {
            return declaration.kind === 'model' && declaration.name.value === selection.model;
        }
    );
    if (models.length !== 1) {
        throw new Error(
            `fieldsFromPrisma: expected one model named ${selection.model}; found ${models.length}.`
        );
    }
    const model = models[0];
    checkAttributes(
        model.members.filter(function isAttribute(member): member is BlockAttribute {
            return member.kind === 'blockAttribute';
        }),
        modelAttributes,
        `model ${selection.model}`
    );
    const enums = new Map<string, EnumDeclaration>();
    for (const declaration of parsed.declarations) {
        if (declaration.kind === 'enum') {
            if (enums.has(declaration.name.value)) {
                throw new Error(`fieldsFromPrisma: duplicate enum ${declaration.name.value}.`);
            }
            enums.set(declaration.name.value, declaration);
        }
    }

    return Object.fromEntries(
        selection.fields.map(function translate(name) {
            const matches = model.members.filter(
                function isField(member): member is FieldDeclaration {
                    return member.kind === 'field' && member.name.value === name;
                }
            );
            if (matches.length !== 1) {
                throw new Error(
                    `fieldsFromPrisma: expected one field ${selection.model}.${name}; found ${matches.length}.`
                );
            }
            return [name, translateField(matches[0], enums, selection.model)];
        })
    );
}
