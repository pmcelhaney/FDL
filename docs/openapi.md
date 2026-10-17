# OpenAPI schemas to FDL fields

`fieldsFromOpenAPI()` translates selected properties of an OpenAPI component
schema into ordinary, immutable FDL field definitions. It accepts YAML, JSON
text, or an already parsed document. No API calls, file reads, or code generation
are needed.

## Quickstart

```javascript
import { Record } from '@pmcelhaney/fdl';
import { fieldsFromOpenAPI } from '@pmcelhaney/fdl/openapi';

const document = `
openapi: 3.1.0
info:
  title: Products
  version: '1'
paths: {}
components:
  schemas:
    Product:
      type: object
      required: [name, stock, category]
      properties:
        name:
          type: string
          title: Product name
          minLength: 1
          maxLength: 80
        stock:
          type: integer
          minimum: 0
        category:
          type: string
          enum: [COFFEE, TEA]
`;

const fields = fieldsFromOpenAPI(document, {
    schema: 'Product',
    fields: ['name', 'stock', 'category'],
});

const product = new Record(
    {
        ...fields,
        stock: fields.stock.label('Units in stock').textAlign('right'),
        category: fields.category.label('Category'),
    },
    { name: 'Breakfast blend', stock: 12, category: 'COFFEE' }
);

product.isValid(); // true
product.isValid('stock', -1); // false: minimum is 0
product.isValid('name', ''); // false: minLength is 1
```

The returned map can also be passed to `Recordset`. You can specialize any
returned definition with normal modifiers without changing the original map.

## Arguments and result

Import the function and its selection type from `@pmcelhaney/fdl/openapi`:

```typescript
fieldsFromOpenAPI(source: string | object, selection: OpenAPIFieldSelection)
```

| Argument                              | Meaning                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| `source`                              | OpenAPI YAML, JSON text, or a parsed document object. It is not a file path or URL. |
| `selection.schema: string`            | Exact name under `components.schemas`, such as `Product`.                           |
| `selection.fields: readonly string[]` | Nonempty list of distinct property names to translate, in output order.             |

The function is synchronous and returns a map of FDL builders. It does not mutate
the input document. Only selected properties are translated; an unselected array
or nested object can remain in the source schema. Unknown selections and
unsupported declarations throw errors that identify the schema or property.

The adapter supports OpenAPI `3.0.x` and `3.1.x`. It checks the selected schema
subset, rather than validating the complete OpenAPI document. Swagger 2,
OpenAPI 3.2, and explicit JSON Schema dialect declarations are not supported.

## Types and constraints

The selected component must declare `type: object` and `properties`. Each selected
property must declare a supported scalar type, directly or through a local
reference.

| OpenAPI schema keyword                 | Generated behavior                                                                                             |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `type: string`                         | Requires a JavaScript string.                                                                                  |
| `type: integer`                        | Requires a JavaScript safe integer, including negative values unless constrained.                              |
| `type: number`                         | Requires a finite JavaScript number.                                                                           |
| `type: boolean`                        | Requires `true` or `false`.                                                                                    |
| `enum`                                 | Adds selectable options and validates membership. Values must match the declared type.                         |
| `const` (3.1 only)                     | Validates equality to the declared scalar or nullable value.                                                   |
| `minLength`, `maxLength`               | Validates string length in Unicode code points, including empty strings.                                       |
| `pattern`                              | Applies an unanchored JavaScript Unicode regular expression. Use `^` and `$` for a whole-string match.         |
| `minimum`, `maximum`                   | Validates inclusive numeric bounds.                                                                            |
| `exclusiveMinimum`, `exclusiveMaximum` | Validates exclusive bounds using the version-specific syntax below.                                            |
| `multipleOf`                           | Checks multiples using exact decimal representations of JavaScript numbers, avoiding division rounding errors. |
| `title`                                | Sets the field label.                                                                                          |

Integer validation intentionally stays within JavaScript's safe range. It does
not provide arbitrary-precision JSON numbers. `multipleOf: 0.1` accepts `0.3`;
it rejects `0.30000000000000004`. Numeric strings are not coerced.

The adapter uses its own validators for schema constraints so that empty strings
and Unicode lengths follow schema semantics. These checks run through the FDL
model, including candidate and asynchronous validation APIs.

## Required properties and nullability

OpenAPI's parent `required` list means that a property must be present. It does
not mean a string must be nonempty or a nullable value must be non-null. The
adapter therefore does not automatically add FDL's `.required()` modifier.
Use `minLength: 1` for a nonempty string, or specialize the definition with
`.required()` when that matches your application rule.

For optional selected properties, `undefined` represents absence and passes
validation. For required selected properties, `undefined` is invalid. Supply
an own property for every selected field in the `Record` values object, using
`undefined` for absent optional values. FDL's whole-record validation iterates
the supplied value keys; the adapter does not change that behavior or validate
the shape of an entire request object.

In OpenAPI 3.0, use `type: string` with `nullable: true`. In 3.1, use
`type: [string, 'null']`. Only a single scalar type combined with `null` is
supported. Nullability does not override `enum` or `const`: `null` must also
satisfy those constraints when they are present.

OpenAPI 3.0 exclusive bounds are booleans used with `minimum` or `maximum`.
OpenAPI 3.1 exclusive bounds are numbers in their own right. The adapter rejects
syntax from the wrong version.

## References

Local `$ref` chains are supported on the selected component and its selected
properties. JSON Pointer escapes such as `~1` for `/` and `~0` for `~` are decoded.
References are resolved only against the supplied document. Cycles, unresolved
references, external references, and schema constraint siblings beside `$ref`
produce errors. Only `summary` and `description` siblings are accepted; they do
not change field validation.

## Annotations and unsupported behavior

`format`, `description`, `default`, `example`, `examples`, `deprecated`,
`readOnly`, `writeOnly`, `externalDocs`, `xml`, and `x-` extensions are accepted
as annotations. Apart from `title`, they do not configure field behavior.
In particular:

- Formats such as `email`, `date`, `date-time`, `int32`, and `int64` do not add validators. Date values stay as API strings. Add an application validator or parser when needed.
- `readOnly` and `writeOnly` do not impose editability or request/response policies without application context.
- Defaults are not applied. Primitive FDL defaults are removed; `record.clear()` falls back to empty strings. `reset()` restores initial values.

Selected arrays, nested objects, boolean schemas, general type unions,
`allOf`, `oneOf`, `anyOf`, conditional schemas, and other unknown keywords are
rejected. Object-wide rules that cannot be represented by independent fields
are also rejected. Boolean `additionalProperties` is accepted as object-shape
metadata, but the adapter does not enforce extra-property policy; schema-valued
`additionalProperties` is unsupported.

This function translates named component schemas, not operation parameters,
request-body selection, authentication, API submission, or persistence errors.
It keeps those integration responsibilities separate from reusable field rules.

The supported semantics follow the
[OpenAPI 3.0 Schema Object](https://spec.openapis.org/oas/v3.0.4.html#schema-object),
[OpenAPI 3.1 Schema Object](https://spec.openapis.org/oas/v3.1.1.html#schema-object),
and [JSON Schema validation](https://json-schema.org/draft/2020-12/json-schema-validation).
For a database schema source, see the [Prisma adapter](./prisma.md).
For model operations, see [Record](./record.md).
