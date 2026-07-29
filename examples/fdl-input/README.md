# FDL input demo

This example uses TypeScript source files, so it must be served by Vite rather
than opened directly from the filesystem.

```sh
npm run example:fdl-input
```

Then open the exact URL printed by Vite (normally
[`http://localhost:5173/`](http://localhost:5173/)). Do not open
`examples/fdl-input/index.html` with a `file://` URL.

The page contains two `<fdl-input>` elements. Each extends `FormElement` and
is connected to the same `Record`; the JSON preview updates after a field's
native `change` event. The email field also uses `requiredWhen()` and becomes
required after the full-name field has a value. A third field demonstrates an
`fdl-select` subclass of `FormElement`; its field type uses
`.tag('select').options(...)` to create the native dropdown inside it.
