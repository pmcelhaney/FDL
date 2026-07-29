# FDL modifier scenarios

This example uses TypeScript source files, so it must be served by Vite rather
than opened directly from the filesystem.

```sh
npm run example:fdl-input
```

Then open the exact URL printed by Vite (normally
[`http://localhost:5173/`](http://localhost:5173/)). Do not open
`examples/fdl-input/index.html` with a `file://` URL.

The page contains three realistic scenarios:

- employee onboarding demonstrates labels, native input attributes, validation,
  conditional requirements, defaults, and read-only values;
- a purchase order demonstrates conditional visibility, disabled state, a native
  select, and a multi-row textarea;
- an invoice collection table demonstrates formatting, conditional classes,
  row classes, and aggregation.

The modifier cookbook at the end of the page includes every public builder API
in alphabetical order. Each entry explains one modifier and either provides a
focused live example or clearly documents why this native-control example does
not yet have enough integration to demonstrate it honestly. Expandable field-
type definitions accompany the functional examples.
