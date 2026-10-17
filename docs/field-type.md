# Binding components to FDL fields

This page is for authors of form controls, table renderers, filters, and other
components that consume FDL. It describes the boundary between an FDL model and
your renderer.

FDL owns field meaning and model state. Your component owns semantic HTML,
accessible relationships, interaction policy, focus, events, layout, and visual
styling. The integration flow is:

```text
Field definition -> Record/Recordset -> component state -> accessible UI
                                      <- parsed user input
```

Do not make the component the source of business rules. Read the current state
from the `Record` and `FieldType`, and send user input back through the record's
parsing API.

## The renderer contract

A component that renders one field needs two inputs:

- `record`: the model containing values and finalized field behavior;
- `field`: the field name to render.

Resolve the field once the component has both inputs:

```js
const field = record.field(fieldName);
const fieldType = record.fieldTypeForField(fieldName);
```

Use the `Field` facade when the component needs the common value and validity
surface:

| Need | Read or write |
| --- | --- |
| Formatted value for display | `field.value` |
| Stored value | `field.rawValue` |
| Accept editable input | `field.value = input` |
| Formatted input value | `field.focusedInputValue` or `field.blurredInputValue` |
| Current validity | `field.valid` or `field.invalid` |
| Validate a proposed input | `field.isValidValue(input)` |

`field.value = input` parses the input and stores the parsed result. Use
`field.rawValue` only when the component is intentionally writing an already
parsed model value. For model or service code, the equivalent explicit APIs are
`record.parseAndSetField(name, input)`, `record.getField(name)`, and
`record.setField(name, value)`.

The `Field` facade is a convenient component surface, not a second model. The
`Record` remains the source of truth. Subscribe to the record's `change` event
or the field facade's `change` event and re-read state when the model changes.

```js
const field = record.field(fieldName);

field.onChange(() => {
    render(field.value, field.valid);
});

record.addEventListener('change', event => {
    if (event.detail.field === fieldName) render(field.value, field.valid);
});
```

## Resolve semantics; choose presentation

`FieldType` exposes the reusable behavior a component needs. Resolve each value
against the current record rather than copying field-definition properties into
component state.

| Component question | `FieldType` API |
| --- | --- |
| What should be shown? | `fieldType.format(value, record, context)` or `record.print(name)` |
| How should input be stored? | `fieldType.parse(input, record, context)` or `record.parseAndSetField(name, input)` |
| Is it required? | `fieldType.required(value, record, context)` |
| Is it disabled? | `fieldType.isDisabled(value, record, context)` |
| Is it read-only? | `fieldType.readonly(value, record, context)` |
| Should it be visible? | `fieldType.visible(value, record, context)` |
| What label or placeholder applies? | `fieldType.label(value, record, context)` and `fieldType.placeholder(value, record, context)` |
| What input metadata applies? | `fieldType.type()`, `accept()`, `autocomplete()`, `pattern()`, and `step()` |
| What classes apply to this value? | `fieldType.cellClasses(value, record)` |

The exact context is a renderer decision. Use a stable context such as
`"model"`, `"input-focus"`, or `"print"` when a formatter, parser, or setting
needs to distinguish consumers. Do not invent context-specific business rules
in the component; the component chooses which existing representation it needs.

For a read-only display, prefer `record.print(name)` or `field.value`. For an
editable control, use the parsed value setter and keep the in-progress display
value in the control until the next model synchronization. This matters for
inputs such as numeric fields where `12.` may be a valid intermediate string.

## Build one field component

The component should select an appropriate semantic control from field metadata,
not require a different public component for every native element. The built-in
Lit adapter follows this policy:

- fields with options use a select-like control;
- fields configured for multiple values use a multi-selection control;
- other fields use an input-like control;
- read-only fields can use a semantic `output`.

A custom renderer can choose a different semantic interaction—such as a radio
group, autocomplete, or command palette—while keeping the same model contract.
The choice of element belongs to the renderer, not to `FieldType`.

Every editable control should establish its own accessible structure:

1. Generate a stable, opaque control ID for the component instance.
2. Resolve the field label and associate it with that ID.
3. Apply required, disabled, read-only, and visible state semantically.
4. Connect descriptions and validation messages with `aria-describedby`.
5. Use `aria-invalid` when the application has decided to show a model error.
6. Translate control events into parsed record updates.

Generated IDs are component details. They are not field names or domain IDs and
must not be persisted or parsed by application code.

## Options and selection

Use `record.optionsForField(name)` when loading options for a control. It
applies FDL's disabled-state gate and participates in the record's dependency
and selection reconciliation. Await `record.whenOptionsReady()` before treating
a changed selection and its dependent fields as settled.

```js
const options = await record.optionsForField(fieldName);
renderOptions(options);

control.addEventListener('change', event => {
    field.value = readControlValue(event.target);
});
```

Option objects normally expose `text` and `value`. The renderer decides whether
to use a native select, a custom listbox, a radio group, or another interaction.
The control must preserve the option value identity expected by the model; a
native adapter may need to serialize values for the DOM and map them back.

When an option field depends on another field, the record owns refresh and
reconciliation. The component should show loading state, re-read the options,
and render the current record value after the update. Do not independently
clear selections or implement a second dependency graph in the component.

`multipleValues(min, max)` exposes selection-count metadata. It does not itself
validate the count. If the model requires a particular number of selections,
the field definition must also provide a validator; the component should report
the resulting model error rather than enforce a new rule locally.

## Validation and error display

FDL determines validity. The application or adapter decides when validation
becomes visible—for example, after blur, after a field is touched, or after a
submit attempt.

When showing a synchronous field error:

1. Read the current errors from the `Record`.
2. Render a concise, readable error message adjacent to the control.
3. Set `aria-invalid="true"` on the editable control or read-only output.
4. Add the error element's ID to `aria-describedby` without discarding other
   description IDs.
5. Remove only the adapter-owned error reference when the error is hidden or
   resolved.

Do not infer validity from CSS, a browser constraint, or an asterisk. Native
constraint validation can support interaction, but `Record.isValid()` is the
model authority.

Synchronous validation throws if it encounters a promise-returning validator.
For async rules, await `record.isValidAsync(name)` or
`record.errorsAsync()`, then define the pending, server-error, and submission
display policy in the application-specific adapter. The built-in `Field` facade
and form adapter are synchronous surfaces.

## Table and repeated-record components

For a table, use a `Recordset` as the row model. The recordset shares finalized
field behavior across its rows:

```js
const fieldType = recordset.getFieldType(columnName);
const records = recordset.currentPage;
```

Resolve table-wide and row-specific presentation at their natural scopes:

| Scope | API | Attach to |
| --- | --- | --- |
| Column-wide classes | `fieldType.columnClasses()` | `<col>`, header, and data cells |
| One row | `fieldType.rowClasses(record)` | The row |
| One value | `fieldType.cellClasses(value, record)` | The data cell |
| Column alignment | `fieldType.textAlign(value, record, 'table')` | Header and cells as appropriate |
| Column sizing | `minColumnWidth()`, `targetColumnWidth()`, `maxColumnWidth()` | Column layout |

Column callbacks have no record or value because a column can exist when the
table has no rows. Resolve them once per column on each render. Combine
column-wide classes with the current cell's classes; do not expect HTML column
styles to propagate to individual cells automatically.

The table owns sorting, filtering, pagination, and loading presentation. FDL
owns field values, formatters, parsers, validators, options, and declared
dependencies. Keep those responsibilities separate so the same field definition
can serve a form, table, printed view, or export.

## Keep the boundary intact

FDL owns:

- stored values, parsing, formatting, and templates;
- validation, emptiness, requiredness, visibility, disabled, and read-only state;
- options, selection reconciliation, and field dependencies; and
- renderer-independent table intent such as alignment and column-width hints.

The component or adapter owns:

- semantic elements, labels, IDs, focus, keyboard behavior, and events;
- when validation is shown and how pending or server errors are presented;
- control-specific value serialization and interaction; and
- layout, styling, design-system integration, and visual treatment.

If a proposed component feature adds a business rule, put the rule in the field
definition or record. If it chooses markup, interaction, or appearance, keep it
in the component or adapter. This separation lets multiple consumers interpret
the same FDL model without coupling the model to one UI framework.
