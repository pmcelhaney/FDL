# FDL

FDL (pronounced “fiddle”) is a library for building complex forms and tables
with interdependent fields and validation rules. It keeps field behavior in a
declarative model so UI components can focus on presentation.

## Example: Dog Walking Service

Imagine a scheduling form for a dog-walking business. It has four fields:
name, date, new-customer status, and comments, with these rules:

- Name must be 2–20 characters and is capitalized for display.
- The new-customer checkbox is disabled for unrecognized names.
- Dates must be weekdays, cannot be holidays, and new customers may book only on Friday.
- Comments are required for new customers.

Putting these rules directly in a template or scattering them through event
handlers makes them difficult to reuse and maintain. With FDL, define the
rules alongside each field type; the view only decides where to render fields.

```js
import { string, boolean, date, Record } from "digital-fdl";

const name = string.with
  .minLength(2)
  .and.maxLength(20)
  .and.formatter(capitalize);
const newCustomer = boolean.with
  .defaultValue(false)
  .thatIs.disabledWhen(isNewCustomer);
const appointmentDate = date.with
  .validator({ name: "weekday", validate: isWeekday })
  .and.validator({ name: "not-holiday", validate: isNotHoliday })
  .and.validator({
    name: "new-customer-day",
    validate: isExistingCustomerOrNewCustomerDay,
  });
const comments = string.thatIs.requiredWhen(isNewCustomer);

const appointment = new Record({
  name,
  newCustomer,
  date: appointmentDate,
  comments,
}, {
  name: "",
  newCustomer: false,
  date: null,
  comments: "",
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isNewCustomer(record) {
  return !existingCustomers.includes(record.getField("name"));
}

function isWeekday(value) {
  return value.getDay() !== 0 && value.getDay() !== 6;
}

function isNotHoliday(value) {
  return !holidays.includes(value);
}

function isExistingCustomerOrNewCustomerDay(value, _, record) {
  return existingCustomers.includes(record.getField("name")) || value.getDay() === 5;
}
```

## Docs

In the example, `string`, `boolean`, and `date` are `FieldType` instances. A
[Record](./docs/record.md) connects those definitions to values. A
[Recordset](./docs/recordset.md) manages a collection of records, including
fetching, sorting, filtering, and pagination.

Custom Lit controls can extend [`FormElement`](./docs/form-element.md) to connect a component to a field in a `Record`.

Contributors working on field behavior, components, or presentation should
follow the [FDL design principles](./docs/design-principles.md).

## Development

Run the test suite with `npm test`. The interactive form-control example is in
[`examples/fdl-input`](./examples/fdl-input/); start it with
`npm run example:fdl-input`.
