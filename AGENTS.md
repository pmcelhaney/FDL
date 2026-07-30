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

## Architecture and design principles

- Read [the design principles](docs/design-principles.md) before changing
  modifiers, components, or presentation behavior.
- Keep business rules, UI semantics, and visual presentation orthogonal:
  FDL owns reusable field and record behavior, components own accessible
  structure and interaction, and CSS owns visual expression.
- Modifiers should describe renderer-independent field behavior or stable
  cross-consumer presentation intent. Do not add DOM-specific properties,
  component escape hatches, lifecycle hooks, or event-driven orchestration to
  `FieldType`.
- When a rule is model behavior, enforce it in `FieldType`, `Record`, or
  `Recordset`; do not rely on CSS or a browser attribute as the source of
  truth.
- Keep the dependency direction moving forward: business rules -> semantic
  state -> accessible component -> visual theme.

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

## Parallel task worktrees

- Keep the repository root checkout as the integration worktree. Do not use it
  for task implementation while another task is active.
- Each parallel task must use a linked worktree under `.worktrees/<task-name>`
  on its own `codex/<task-name>` branch.
- Create a task worktree from the current integration branch with:
  `git worktree add .worktrees/<task-name> -b codex/<task-name> main`
- A task owns only its assigned worktree and branch. Do not edit another task's
  worktree or branch.
- Run the relevant tests and type checks in the task worktree, commit the
  completed batch there, then merge the task branch from the integration
  worktree.
- After a successful merge, remove the linked worktree with
  `git worktree remove .worktrees/<task-name>` and prune stale metadata with
  `git worktree prune`.
- Never create a new task worktree from a dirty checkout; commit or explicitly
  isolate the pending changes first.
