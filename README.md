# FDL — Field Definition Library

[![Tests](https://github.com/pmcelhaney/FDL/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/pmcelhaney/FDL/actions/workflows/tests.yml)
[![Type check](https://github.com/pmcelhaney/FDL/actions/workflows/typecheck.yml/badge.svg?branch=main)](https://github.com/pmcelhaney/FDL/actions/workflows/typecheck.yml)
[![Documentation build](https://github.com/pmcelhaney/FDL/actions/workflows/docs-build.yml/badge.svg?branch=main)](https://github.com/pmcelhaney/FDL/actions/workflows/docs-build.yml)

FDL (pronounced “fiddle”) is a JavaScript/TypeScript library for modeling complex
forms and tables. Define field types, validation, dependencies, records, and
recordsets declaratively so UI components can concentrate on rendering.

FDL keeps reusable business rules independent of the UI, including parsing,
formatting, validation, filtering, and aggregation.

## Project status

FDL is a work in progress. **Version 1.0 is expected to ship in November 2026.**
The API and documentation may change before that release.

## Installation

```sh
npm install @pmcelhaney/fdl
```

## Try a rule without a UI

A **field definition** describes reusable rules for one value. A **Record**
binds field definitions to a set of values; a **Recordset** manages a collection
of records that share definitions.

```js
import { field, Record } from '@pmcelhaney/fdl';

const account = new Record(
    {
        country: field.label('Country code').required(),
        taxId: field.label('Tax ID').required(record => record.getField('country') !== 'US'),
    },
    { country: 'US', taxId: '' }
);

console.log(account.isValid()); // true: a domestic account needs no Tax ID

account.setField('country', 'CA');
console.log(account.isValid()); // false
console.log(account.readableRecordErrors()); // ['Tax ID: is required']

account.setField('taxId', 'CA123456');
console.log(account.isValid()); // true
```

Changing the country changes requiredness through the field definition. This
example checks presence; a Tax ID format rule would be a separate validator.
The initial values are explicit: `defaultValue()` applies when clearing a
record, rather than filling its constructor values.

## Build your first form

The documentation site includes a complete first-form guide with imports,
adapter registration, a displayed validation error, and TypeScript setup.
To run it locally:

```sh
git clone https://github.com/pmcelhaney/FDL.git
cd FDL
npm install
npm run docs:dev
```

Open [Your first form](http://localhost:5173/#quickstart). If the server prints
a different URL, open that URL and choose **Your first form** from the navigation.
The same site includes the interactive examples and API references.

The guide uses a Lit adapter. React applications can keep their existing
components and connect them to the same FDL model; see
[Adapter and API contracts](http://localhost:5173/#integration) on the local site
for subscriptions, edit handling, and accessible state mapping. Your application
owns submission, server validation, routing, and persistence.

## License

[Apache License 2.0](./LICENSE)
