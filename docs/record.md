# Record

A `Record` combines a map of field names and `FieldType` definitions with one
object of values. It is the model passed to FDL form controls.

```js
import { Record, string } from 'digital-fdl';

const account = new Record(
  {
    name: string.with.label('Account name'),
    accountNumber: string,
  },
  {
    name: 'Checking',
    accountNumber: '92120391',
  }
);
```

## Working with fields

Prefer `record.field(name)` in components and other UI code. It returns a
`Field` object that exposes formatted and raw values, validity, and the field
definition. For example, assigning `field.value` parses the displayed value
before storing it, while `field.rawValue` reads or writes the stored value.

```js
const name = account.field('name');

name.value; // formatted value for display
name.rawValue; // 'Checking'
name.valid; // true or false
```

`getField()` and `setField()` remain useful for model or service code. Both
support dot-separated paths for nested values.

```js
account.setField('name', 'Savings');
account.getField('name'); // 'Savings'
```

## Change events and lifecycle

Changing a value dispatches a native `change` event with the changed field in
`event.detail.field`. `blur` events use the same detail shape.

```js
account.addEventListener('change', event => {
  console.log(event.detail.field);
});

account.setField('name', 'Savings');
```

`reset()` restores the initial values supplied to the constructor. `clear()`
replaces each value with its field type's default value. `hasChanged` reports
whether the current values differ from those initial values.

## Validation and display

`isValid()` checks the entire record; `isValid(fieldName)` checks one field.
Use `errors()`, `errorCount()`, or `hasErrors()` when the individual validation
errors are needed. `print(fieldName)` formats a value for display, and
`parse(fieldName, value)` applies that field's parsers.

```js
if (!account.isValid()) {
  console.log(account.readableRecordErrors());
}

account.print('name');
```

`fieldTypeForField(name)` returns the `FieldType` definition for integrations
that need it directly.
