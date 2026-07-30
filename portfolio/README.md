# FDL portfolio

This is the local portfolio and documentation site for FDL. It includes the
narrative ACH workflow, architecture case study, project history, modifier
support matrix, and documentation gateway.

The site is local-only by default. Do not publish it without explicit approval.

## Run from the repository root

Use Node.js 22.13 or newer.

```sh
npm run portfolio:setup
npm run portfolio:dev
```

Open the local URL printed by the development server. Changes under
`portfolio/app/` reload automatically.

## Verify

```sh
npm run portfolio:build
npm run portfolio:test
```

The root library tests and type checks remain separate:

```sh
npm test
npm run typecheck
```
