# Binding components to FDL

This page assumes that you have used FDL to define fields and work with
`Record` or `Recordset`, but have not yet built a component that binds to that
model. It is a guide to the public surfaces your component consumes and the
direction of data flow across the model/UI boundary.

The short version is:

```text
Record or Recordset -> component state -> accessible UI
Record or Recordset <- parsed user input
```

FDL owns field meaning and model state. Your component owns semantic HTML,
accessible relationships, interaction policy, focus, events, layout, and visual
styling. Start by learning the four public objects involved in that boundary:

- `Record` is the model for one object of values.
- `Field` is the component-friendly view of one field in a record.
- `FieldType` is the finalized behavior for that field.
- `Recordset` is the model for a collection of records and its table state.

## The public surfaces at a glance

Most form components use `record.field(name)`. Most table components use
`recordset.currentPage`, then use the same `Record` and `Field` surfaces for
each row. Use `FieldType` when the component needs a setting or behavior that
is not exposed by `Field`.

| Object | Represents | Start here |
| --- | --- | --- |
| `Record` | Values, aggregate validation, options reconciliation, and model events for one object | `field(name)`, `isValid()`, `reset()`, `clear()` |
| `Field` | One field's component-facing value, state, validation, options, and input helpers | `value`, `rawValue`, `label`, `required`, `disabled`, `readOnly`, `valid` |
| `FieldType` | A field's finalized behavior for advanced integrations and table rendering | `field.fieldType` |
| `Recordset` | Rows, fetch/update state, filtering, sorting, paging, and collection validation | `currentPage`, `isLoading`, `updating`, `pageSize`, `pageNumber`, `sortColumns` |

The sections below describe these APIs first. The integration guidance after
them shows how to combine them into a component.

## `Record`: one model object

A `Record` owns one values object and the finalized `FieldType` for each declared
field. A component should treat the record as the source of truth and re-read
from it after every model change.

### Properties

| Property | Component use |
| --- | --- |
| `values` | The backing values object. Read it for serialization or debugging; prefer `field(name)` for a field and do not mutate it directly. |
| `fieldTypes` | The finalized field types. Prefer `record.field(name).fieldType` from a component. |
| `initialValues` | The values captured for reset and change tracking. Treat as model state, not component state. |
| `hasChanged` | Whether current values differ from the initial values. Useful for dirty-state indicators. |
| `isExpanded` | A public view-model flag used by table/detail-row consumers. |

### Field access and updates

| Method | Purpose |
| --- | --- |
| `field(name)` | Return a `Field` facade for component binding. |
| `hasField(name)` | Test whether the record declares a field. |
| `addField(name, definition, value)` | Add a field and its initial value to a record. |

Editable controls should use `record.field(name).value = input`; that path parses
the input and stores the model value through the field facade.

### Options and lifecycle

| Method | Purpose |
| --- | --- |
| `refreshOptions()` | Request option loading and selection reconciliation. |
| `whenOptionsReady()` | Wait for the current option pass and any dependent passes to settle. |
| `announceChange(name)` | Announce a programmatic model change after a direct mutation or custom update. |
| `announceBlur(name)` | Announce that a field's editing interaction ended. |
| `addEventListener('change', fn)` | Observe model changes; `event.detail.field` contains the changed field name. |
| `addEventListener('blur', fn)` | Observe the field blur event emitted by the model. |

The record automatically refreshes options when a field changes. A component
should render loading state and re-read options after that work rather than
implementing a second dependency graph.

### Validation, reset, and cloning

| Method or property | Purpose |
| --- | --- |
| `isValid()` | Synchronously validate the whole record. |
| `isValidAsync()` | Validate the whole record when rules may return promises. |
| `errors()` / `errorsAsync()` | Get synchronous or asynchronous validation results. |
| `errorCount()` / `hasErrors()` | Summarize current errors. |
| `readableRecordErrors()` | Get errors prepared for record-level display. |
| `invalidValues` | Get the values that currently fail validation. |
| `hasRequiredValues()` | Check whether required values are present. |
| `reset()` | Restore the values captured at construction. |
| `clear()` | Replace values with the field definitions' defaults. |
| `clone(fields)` | Create a related record, optionally limited to selected fields. |
| `hashOfFields(fields)` | Create a stable hash for selected field values. |

Synchronous validation throws when it encounters a promise-returning validator.
Use the async methods in an adapter that supports asynchronous validation and
defines its own pending/error-display policy.

## `Field`: the component-facing field view

`record.field(name)` creates a `Field` bound to one record and field name. It
keeps the binding convenient without creating a second source of truth.

### Identity and value properties

| Property | Meaning |
| --- | --- |
| `record` | The owning `Record`. |
| `fieldName` | The bound field name. |
| `fieldType` | The finalized `FieldType` for the bound field. |
| `value` | The formatted/printed value used for display. Assigning parses and stores input. |
| `rawValue` | The stored model value. Assigning writes directly without parsing. |
| `focusedInputValue` | The formatted value for an active editable control. |
| `blurredInputValue` | The formatted value for a blurred editable control. |
| `valid` / `invalid` | The current synchronous validity of the stored value. |
| `label` | The field label resolved for a form component. |
| `placeholder` | The placeholder resolved for a form component. |
| `required` | Whether the field is required in the form context. |
| `disabled` | Whether the field is disabled in the form context. |
| `readOnly` | Whether the field is read-only in the form context. |
| `visible` | Whether the field is visible in the form context. |

For an editable control, use `field.value = input` so the field's parsers run.
Keep the control's in-progress text locally until the next model synchronization;
this preserves intermediate input such as `12.`. Use `field.rawValue` when the
component is intentionally handling an already parsed value.

### Methods

| Method | Purpose |
| --- | --- |
| `isValid()` / `isValid(value)` | Validate the current or supplied model value synchronously. |
| `isValidAsync()` / `isValidAsync(value)` | Validate the current or supplied model value asynchronously. |
| `errors()` / `errorsAsync()` | Read the current or supplied validation errors. |
| `readableErrors()` | Read field errors prepared for display. |
| `isValidValue(input)` | Parse and synchronously validate a proposed input without storing it. |
| `isValidValueAsync(input)` | Async version of proposed-value validation. |
| `parse(input, context)` | Parse input into a model value without storing it. |
| `format(value, context)` | Format a model value for a renderer context. |
| `print(value)` | Format a value and apply its print template. |
| `options()` | Load this field's choices through the record's disabled-state gate. |
| `refreshOptions()` | Request record-wide option loading and reconciliation. |
| `whenOptionsReady()` | Wait for record-wide option loading and dependent reconciliation. |
| `onChange(fn)` | Listen for a change to this field's value or validity. |
| `allowInputChar(char)` | Apply the field's input-character rule. |
| `field(nameOrIndex)` | Address a nested field or part. |
| `minValueCount()` / `maxValueCount()` | Read multiple-value count metadata. |

The facade reports a field change when the record changes its raw value or
validity. It does not replace the record's broader `change` event, which remains
useful when a component depends on other fields.

## Field operations

Formatting, parsing, validation, setting, options, and field state all live on
the `Field` facade. This keeps a component from repeatedly resolving a field
name against the record. Use the record's aggregate methods only when the
component needs whole-record status.

## Advanced: `FieldType` behavior

`record.field(name).fieldType` returns the finalized `FieldType`. Components
should start with `Field`; use `FieldType` directly only for advanced behavior,
custom renderers, or table-wide metadata that is not part of a bound field.

### Value and state behavior

| Method | Component use |
| --- | --- |
| `format(value, record, context)` | Format a value for a renderer context. |
| `print(value, record)` | Format and apply a print template. |
| `parse(input, record, context)` | Parse renderer input into a model value. |
| `validate(field, modelValue, viewValue, record, options)` | Run synchronous field validators. |
| `validateAsync(...)` | Run validators that may be asynchronous. |
| `isEmpty(value, record, context)` / `empty(record, name)` | Resolve emptiness rules. |
| `required(value, record, context)` | Resolve requiredness. |
| `visible(value, record, context)` | Resolve visibility. |
| `isDisabled(value, record, context)` | Resolve disabled state. |
| `readonly(value, record, context)` | Resolve read-only state. |
| `label(value, record, context)` | Resolve a label. |
| `placeholder(value, record, context)` | Resolve a placeholder. |
| `defaultValue(value, record, context)` | Resolve a default for record operations. |

Other renderer metadata includes `type()`, `accept()`, `autocomplete()`,
`autofocus()`, `pattern()`, `step()`, `info()`, `formElement()`, and
`additionalProperties()`. Treat these as inputs to your renderer, not as a
request to copy arbitrary properties onto a DOM element.

### Options and table behavior

| Method | Component use |
| --- | --- |
| `hasOptions()` / `options(record)` | Detect and load choices. Prefer `field.options()` for a control. |
| `hasMultipleValues()` | Choose a multiple-selection interaction. |
| `minValueCount()` / `maxValueCount()` | Read selection-count metadata. |
| `match(searchText, value)` | Apply a field's filter behavior. |
| `cellClasses(value, record)` | Resolve classes for one table cell. |
| `rowClasses(record)` | Resolve classes for one table row. |
| `columnClasses()` | Resolve classes that apply to a whole column. |
| `textAlign(value, record, context)` | Resolve alignment intent. |
| `sortable()` | Determine whether the column is sortable. |
| `minColumnWidth()` / `targetColumnWidth()` / `maxColumnWidth()` | Resolve column sizing guidance. |
| `aggregate(values)` | Calculate a column or group aggregate. |
| `compare(a, b)` | Compare two values for sorting. |

Use a context such as `"model"`, `"input-focus"`, `"input-blur"`, `"table"`,
or `"print"` consistently within your renderer. The component chooses which
representation it needs; the field definition remains renderer-independent.

## `Recordset`: rows and table state

Use a `Recordset` when the component renders a collection. It finalizes the
field definitions once and creates a `Record` for each row. A table should read
rows from the recordset and use the `Record`/`Field` APIs for each cell.

### Row, paging, and fetch properties

| Property | Component use |
| --- | --- |
| `allRecords` | All loaded `Record` instances. |
| `currentPage` | Records currently visible after filtering, sorting, and paging. |
| `cursor` | A small paging/visibility interface for table controls. |
| `isLoading` | Whether a fetch or update is in progress. |
| `updating` | A promise for the most recent update. |
| `pageIndex` / `pageNumber` | Zero-based and one-based page controls. |
| `pageSize` | Number of rows per page. |
| `firstRecordNumberOnPage` / `lastRecordNumberOnPage` | Display ranges for pagination UI. |
| `totalCount` / `filteredCount` | Server or client counts for pagination and summaries. |
| `isClientSide` / `isServerSide` | Which pagination/filtering mode the current data uses. |
| `fieldNames` | Declared column names. |
| `summary` | Fetch-provided collection summary. |
| `parameters` | Fetch parameters. Assigning queues an update. |
| `sortColumns` | Sort descriptors. Assigning queues an update. |
| `filter` | A predicate for client-side record filtering. |
| `hasChanged` | Whether any loaded record has changed. |

### Collection methods

| Method | Purpose |
| --- | --- |
| `requestHardUpdate()` | Fetch and rebuild the current view. Use for the initial load or a forced refresh. |
| `requestSoftUpdate()` / `requestUpdate()` | Request the corresponding queued update behavior. |
| `sort(column)` | Sort using a column descriptor. |
| `reset(hardReset?)` | Restore the recordset's original data and view state. |
| `createRecord(values)` | Create a record using the recordset's field types. |
| `appendRecord()` / `addRecord()` | Add a row. |
| `insertRecord(record, index)` | Insert a row at an index. |
| `updateRecord(record)` | Notify the set that a row changed. |
| `deleteRecord(record)` | Remove a row. |
| `clone()` / `cloneRecord(record, rowIndex, fields)` | Create related collection or row data. |
| `copyFrom(recordset, fields)` | Copy collection data. |
| `getRecordAtIndex(index)` | Read a loaded row by index. |
| `getFieldType(name)` | Read the finalized field behavior for a column. |
| `getData()` / `setData(data)` | Serialize or replace collection data. |
| `isValid()` / `errors()` | Validate the collection and read collection errors. |

For collection-level rules, `addValidator()` and `addValidators()` register
recordset validators. For component subscriptions, use `addEventListener()` or
`onChange(fn)` and await `updating` after changing filters, parameters, sorting,
or paging.

## Binding a form control

Once the public surfaces are clear, a field component has a small loop:

1. Receive a `Record` and field name.
2. Resolve `const field = record.field(name)`.
3. Render `field.value` or `field.focusedInputValue`.
4. Resolve semantics such as `required`, `disabled`, `readOnly`, `visible`, and
   `label` from `field`.
5. On user input, assign `field.value = input`.
6. Listen for model changes and re-read the field.

```js
class FieldController {
    constructor(record, name) {
        this.record = record;
        this.field = record.field(name);
        this.record.addEventListener('change', event => {
            if (event.detail.field === name) this.render();
        });
    }

    input(value) {
        this.field.value = value;
        this.render();
    }

    render() {
        const { field } = this;
        return {
            value: field.focusedInputValue,
            label: field.label,
            required: field.required,
            disabled: field.disabled,
            readOnly: field.readOnly,
            visible: field.visible,
            valid: field.valid,
        };
    }
}
```

The real component must add the accessible structure around this state:

- generate a stable, opaque control ID;
- associate the visible label with that ID;
- express required, disabled, read-only, and visibility semantically;
- connect descriptions and validation messages with `aria-describedby`; and
- use `aria-invalid` when the application has decided to show a model error.

Generated IDs are component details, not field names or domain IDs. Do not
persist them or make application logic depend on their format.

## Options and selection

Use `record.field(name).options()` when loading choices. It applies the
record's disabled-state gate and participates in dependency and selection
reconciliation:

```js
const field = record.field(fieldName);
const options = await field.options();
renderOptions(options);

control.addEventListener('change', event => {
    field.value = readControlValue(event.target);
});

await field.whenOptionsReady();
```

Option objects normally expose `text` and `value`. The renderer decides whether
to use a native select, listbox, radio group, autocomplete, or another
interaction. Preserve the option value identity expected by the model; a native
adapter may serialize values for the DOM and map them back.

When options depend on another field, the record owns refresh and reconciliation.
The component shows loading state, re-reads options, and renders the current
record value after the update. It should not clear selections or implement a
second dependency graph.

`multipleValues(min, max)` exposes selection-count metadata; it does not itself
validate the count. If the model requires a particular number of selections,
the field definition must provide a validator and the component should display
that model error.

## Validation and error display

FDL determines validity. The application or adapter decides when validation
becomes visible—for example, after blur, after a field is touched, or after a
submit attempt.

When showing a synchronous field error:

1. Read `record.field(name).readableErrors()`.
2. Render a concise, readable error message adjacent to the control.
3. Set `aria-invalid="true"` on the editable control or read-only output.
4. Add the error element's ID to `aria-describedby` without discarding other
   description IDs.
5. Remove only the adapter-owned error reference when the error is hidden or
   resolved.

Do not infer validity from CSS, a browser constraint, or an asterisk. Native
constraint validation can support interaction, but `Record.isValid()` is the
model authority for the whole record. For one field, await
`field.isValidAsync()` or `field.errorsAsync()`; for the whole record, await
`record.isValidAsync()` or `record.errorsAsync()`. Define pending and
server-error display in the application-specific adapter.

## Binding a table

Read rows from `recordset.currentPage` and subscribe to the recordset's update
events. The table owns loading, sorting, filtering, pagination, and empty-state
presentation; FDL owns the values and field behavior.

```js
const fieldType = recordset.getFieldType(columnName);
const rows = recordset.currentPage;

for (const record of rows) {
    const field = record.field(columnName);
    renderCell(field.value, field.valid);
}
```

For example, a table component can construct a recordset, load its first page,
and render each row through the field facade:

```js
import { field, Recordset } from '@pmcelhaney/fdl';

const people = new Recordset(
    { name: field.label('Name'), city: field.label('City') },
    [
        { name: 'Zulu', city: 'Oslo' },
        { name: 'Alpha', city: 'Lima' },
        { name: 'Mike', city: 'Paris' },
    ]
);

people.sortColumns = [{ field: 'name', sort: 'ascending' }];
await people.requestUpdate();
```

Resolve table presentation at its natural scope:

| Scope | API | Attach to |
| --- | --- | --- |
| Column-wide classes | `fieldType.columnClasses()` | `<col>`, header, and data cells |
| One row | `fieldType.rowClasses(record)` | The row |
| One value | `fieldType.cellClasses(value, record)` | The data cell |
| Alignment | `fieldType.textAlign(value, record, 'table')` | Header and cells as appropriate |
| Sizing | `minColumnWidth()`, `targetColumnWidth()`, `maxColumnWidth()` | Column layout |

Column callbacks have no record or value because a column can exist when there
are no rows. Resolve them once per column on each render. Combine column-wide
classes with each cell's classes; do not expect HTML column styles to propagate
to individual cells automatically.

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
