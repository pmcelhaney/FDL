# FDL documentation site

This is the repository's only documentation website. It includes Home, How it
Works, Learn by exploring, Modifier categories, Contributing, and modifier reference pages that group closely related rules, with live examples, model-level
exercises, highlighted definitions, and rendering markup. The source uses Lit
and TypeScript, so serve it through Vite instead of opening HTML files directly.

From the repository root:

```sh
npm ci
npm run docs:dev
```

Open the root URL printed by Vite (normally `http://localhost:5173/`).

```sh
npm test
npm run typecheck
npm run docs:build
```

The production output is `examples/fdl-input/dist/`, with a single `index.html`
entry point. Building and previewing do not deploy the site.

Primary interactive examples open by default in `<fdl-example>`, with source-file
tabs alongside the working demo. Set `.expanded=${false}` for secondary examples
such as the deprecated row-count demonstration. Slot the working demo inside it and pass `filenames` and
`sources` for the model, view, and optional CSS. Modifier examples also set
`modifier` to highlight the relevant calls in the model tab.

Every editable field example uses `<fdl-field>` bound to an FDL record. The
field metadata selects a native input, select, or textarea. Table separators
support keyboard resizing: Left/Right for one pixel, Shift for ten pixels,
and Home/End for the available minimum/maximum.

The Documentation library (`#reference`) renders all repository guides, API
references, and architecture decisions within the site. Markdown in `docs/` and
the repository root remains the source; Vite compiles it into the site and rewrites
relative documentation links to local routes.

## Exploring the explanations

- `#categories` explains all seven category purposes, lists each current modifier,
  and connects related rules with links to their live examples. Category jump
  links preserve the section in the URL.

- Home starts with a delivery experiment. Pickup keeps the store selector visible
  but disabled until a five-digit ZIP is entered. Sample store lookups for 28202
  and 10001 simulate a two-second delay with a loading spinner; changing the ZIP
  starts a new lookup, older results cannot overwrite it, and the record clears
  a store selection absent from the latest choices. `#learn` builds one
  example through storage, parsing, validation, dependencies, and collection reuse.
- `#composition` connects adjustable visibility, requiredness, and validation
  rules to six model-computed outcomes and a selected live form. Selecting an
  outcome loads its exact sample; editing the form highlights the matching
  address category. The address-format check is illustrative.
- How it Works compares a base field with two independent specializations, then
  demonstrates model-only validation before binding a component.
- Record and recordset inspectors appear directly beside or below their examples.
  Each inspector owns its collapse control; do not wrap it in another disclosure.
  Dependency traces read FDL's public state methods.
- Requiredness, text lengths, column widths, and filter matching have adjustable
  rules. Their model and view files read the settings used by the live demo. Length changes preserve the
  entered code; width changes restore the initial table layout.
- Validator, filter, and comparator examples compare several cases at once.
  Parser and formatter pages trace original input through stored and display values.
- Each supported modifier example has a small model factory and a rendering
  function in `live-examples/<modifier>/`. Source tabs read those exact files
  with Vite's `?raw` imports. The example wrapper imports and calls the factory
  and renderer, so the displayed code is the code that runs.
- Keep tutorial state, rule selectors, validation buttons, dependency
  explanations, inspectors, styles, and lifecycle handling in the example
  wrapper. These support the lesson without becoming part of the code a reader
  needs to render the domain fields or table. Shared subscriptions live in
  `example-controller.js`.
- Text-length and column-width pages share canonical model/view pairs in
  `live-examples/text-length/` and `live-examples/column-widths/`. Their individual
  modifier routes use those same files rather than parallel implementations.
- The delivery, conditional-validation, specialization, learning, composition,
  cancellation, field-builder, and editable-recordset examples follow the same
  separation. Their page components call the small view functions and keep the
  teaching interface outside the displayed source.
- Class-based styling examples (`cellClass` and
  `rowClass`) also provide a CSS tab. These rules are shared
  with the live adapters through literal CSS imports and belong in its shadow-root stylesheet, not the page
  stylesheet.

Keep explanations connected to actual FDL behavior. Configuration controls may
change the example's rule, but every editable domain value remains bound through
`fdl-field`. Preserve explicit adapter limitations instead of inventing support.

Disabled field controls use a gray fill, dashed border, and unavailable cursor
while keeping their values readable. The `disabled` page
shows the same CSS used by the field adapter.

The learning path uses a compact question selector and a reset for the current
question. Its final step distinguishes the edited form record from table
snapshots, lists abilities to check, and offers an optional cancellation-rule
transfer challenge. Continuing into composition carries the delivery choice and
charge snapshot in the link; changing between a continued scenario and a plain
composition link starts a fresh experiment.

Composition places rule controls directly before the outcome comparison. Optional
prediction practice reveals actual model outcomes after a guess. Keep up to six
custom cases to compare their saved rules with current rules, restore them, or
remove them. The explorer retains this experiment and its kept cases while visiting other
pages in the same session. Returning resumes that
work.
Opening a different composition scenario starts a fresh experiment; reloading
the site also starts fresh. Reset rules and example preserves kept cases;
Remove and Clear kept cases delete them.

Reference paging follows active search/category results. Narrow screens collapse
navigation behind Browse modifiers. Conditional-cell styling exposes an editable
threshold and boundary cases; width examples expose measured widths and active
constraints. Filter text is shared between the table header and comparison.

Clicking a sortable table heading toggles ascending/descending and makes that
column the first sort priority. Existing columns remain as tie-breakers; clicking
a heading never removes its sort. Keyboard activation uses the same button action.

Related modifiers share one reference page: permanent and conditional cell
classes, disabled state, read-only state, and requiredness; minimum and maximum
text length; and minimum, target, and maximum column widths. Every modifier
retains its original hash link and sidebar entry, which opens its section.
Text length and Column widths each use one shared interactive example, retaining
individual signatures and deep links. Previous/Next navigates between distinct
reference pages. The validator reference links to the complete conditional tax-ID
example on Change and test a rule instead of embedding a second copy.

## Reusing the record inspector

The magnifying-glass button collapses and expands the inspector. Nested record
values appear as a magnifying-glass “record” button; opening one replaces the
header control with a back button. A check or X in the header shows the validity
of the current record (or displayed field subset). The icon legend remains
available in nested views and can be collapsed independently.

Import `./fdl-record-inspector` to register `<fdl-record-inspector>`, then bind
an FDL record as a JavaScript property:

```ts
html`<fdl-record-inspector .record=${record}></fdl-record-inspector>`;
```

The inspector shows every declared field by default, including fields with no
stored value. Set `.fields=${['name', 'email']}` to select and order the displayed
fields. Values are the record's raw stored values, so an option's key appears
rather than its display label. Status icons expose hidden, disabled, read-only,
required, and invalid states. When `fields` selects part of a record, the
validation status covers those displayed fields; otherwise it covers the whole
record.

The magnifying glass button collapses and expands the panel. Set `collapsed`
as an HTML attribute or `.collapsed=${true}` to start with only the icon. The
reflected `collapsed` attribute lets the surrounding layout reclaim the panel's
space, as the delivery example does. The component listens to record changes
and releases its listener when removed or rebound to another record; its parent
does not need to request updates for it. This is a documentation-site component,
imported from the example source alongside `fdl-field`.

## Reusing the recordset inspector

Import `./fdl-recordset-inspector` and bind the live recordset:

```ts
html`<fdl-recordset-inspector
    .recordset=${recordset}
></fdl-recordset-inspector>`;
```

The inspector displays matching, total, loaded, and current-page counts, the page
number and size, sort priorities, and a table of raw stored values on the current
page. Field-state icons and the icon legend are shared with the record inspector.
Applicable field-state icons appear to the left of stored values. A leading status
column shows the same Invalid icon when a complete record fails validation; valid
records have no row status icon or Valid label. The JSON disclosure
includes current-page values and view metadata. Server-side totals can exceed
the number of loaded records; the inspector reports these separately.

CSS class numbers appear beside cell values, in column headers, and at the start
of rows for `cellClass`, `columnClass`, and `rowClass` respectively. A shared legend
maps each number to its class name; hovering a number also reveals the name.
Only classes applicable to the displayed fields and current page appear in the
legend. Numbers stay stable while inspecting the same recordset, including after
edits, filtering, and paging. Rebinding to another recordset restarts numbering.

Use `.fields=${['name', 'amount']}` to select and order the displayed columns;
the default is every declared field. Column headers use field keys to make it
easy to match values to the model source. The panel observes recordset updates
and loaded-record edits independently of its parent and releases subscriptions
when rebound or removed. `collapsed` and `.collapsed=${true}` work like the
record inspector. Inspection does not change sorting, filtering, paging, or data.
