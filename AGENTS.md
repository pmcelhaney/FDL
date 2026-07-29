# FDL contributor guide

## Repository purpose

FDL (pronounced "fiddle") is a JavaScript/TypeScript library for modeling
complex forms and tables. It defines field types, validation, dependencies,
records, and recordsets declaratively so UI components can concentrate on
rendering. The published package is `digital-fdl`.

## Layout

- Root JavaScript modules contain the core runtime: `field.js`, `record.js`,
  `recordset.js`, filters, and utilities.
- TypeScript files provide builder APIs, form integration, declarations, and
  shared types. Public type exports are organized under `types/` and
  `index.d.ts`.
- `tests/` contains Jest unit and integration tests; TypeScript tests run via
  `ts-jest`.
- `docs/` holds the public API documentation.
- `examples/fdl-input/` is a Lit/Vite interactive form-control example.

## Development workflow

- Install dependencies with `npm install`.
- Run tests with `npm test` and static type checks with `npm run typecheck`.
- Use `npm run example:fdl-input` to run the interactive example.
- Keep public behavior, documentation, and type declarations aligned when
  changing exported APIs.
- Add or update focused Jest coverage for behavior changes.

## Live example presentation

- In table examples, scalar numeric fields such as amounts, totals, counts,
  and percentages should be explicitly right-aligned with the example’s field
  configuration. This is a presentation convention for examples, not a rule
  the framework should apply automatically.

## Working-tree and Git rules

- Preserve unrelated edits already present in the working tree; do not stage,
  revert, or reformat them as part of another task.
- After every coherent batch of changes, run the relevant verification and
  commit that batch before beginning the next one.
- Stage and commit only files that belong to the current batch. Use a concise,
  imperative commit message that describes the change.
