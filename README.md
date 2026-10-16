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

Version 0.0.1 is missing its root JavaScript entry file. Until a corrected
release is published, import the included modules directly, as shown below
and in the first-form guide.

## Try a rule without a UI

A **field definition** describes reusable rules for one value. A **Record**
binds field definitions to a set of values; a **Recordset** manages a collection
of records that share definitions.

```js
import { field } from '@pmcelhaney/fdl/primitives';
import Record from '@pmcelhaney/fdl/record';

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

Install the published package in a new application:

```sh
mkdir fdl-first-form
cd fdl-first-form
npm init -y
npm install @pmcelhaney/fdl lit
npm install --save-dev vite@5.4.21 typescript@4.6.4
```

Follow [Your first form](https://patrickmcelhaney.org/FDL/#quickstart) for the
complete script, HTML entry point, adapter registration, and TypeScript setup.
Run `npx vite` in your application and open the local URL it prints. No FDL
checkout or local package build is needed.

The guide uses a Lit adapter. React applications can keep their existing
components and connect them to the same FDL model; see
[Adapter and API contracts](https://patrickmcelhaney.org/FDL/#integration)
for subscriptions, edit handling, and accessible state mapping. Your application
owns submission, server validation, routing, and persistence.

## License

[Apache License 2.0](./LICENSE)
