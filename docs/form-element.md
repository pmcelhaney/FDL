# Form elements

`FormElement` is the Lit base class for FDL field controls. Extend it when you
need a custom element that presents one field from a `Record`.

The base class owns the FDL integration:

- it requires a `record` and `field` property;
- it resolves the field's `FieldType` after the first update;
- it creates the child control named by `FieldType.tag()`;
- it copies the field value and modifiers (`label`, `required`, `disabled`,
  `placeholder`, and so on) to that child;
- it loads `FieldType.options()` when the field has options; and
- it listens for child events and synchronizes the value back to the record.

## A minimal subclass

The subclass normally supplies presentation and registers a custom-element
name. Preserve the base stylesheet by overriding its static getter, not by
assigning a static class field:

```ts
import { css } from 'lit';
import FormElement from '../form-element';

export class FdlSelect extends FormElement {
  static get styles() {
    return css`
      ${FormElement.styles}

      select {
        border: 1px solid #9ca3af;
        border-radius: 0.25rem;
        padding: 0.5rem;
      }
    `;
  }
}

customElements.define('fdl-select', FdlSelect);
```

Use the subclass as the form control and pass the record and field. The
`FieldType` tag names the child control created *inside* the subclass:

```ts
const contactMethod = new FieldType().with
  .tag('select')
  .and.label('Preferred contact method')
  .and.options([
    { text: 'Choose a method', value: '' },
    { text: 'Email', value: 'email' },
    { text: 'Phone', value: 'phone' },
  ]);

const record = new Record({ contactMethod }, { contactMethod: '' });
```

```ts
html`<fdl-select field="contactMethod" .record=${record}></fdl-select>`
```

Do not set the field type's tag to `fdl-select` in this arrangement. That
would make `FormElement` create another `fdl-select` inside the first one.
Use `tag('select')` for the native child and the custom element name for the
outer component.

## Native dropdowns

For a native `select`, `FormElement` converts the option objects returned by
`.options(...)` into `<option>` nodes. Each option should provide `text` and
`value` (or use the documented `options({ data, text, value })` mapping).
Include an empty option when the field starts empty, and use `.required()` or
`.requiredWhen(...)` if choosing an option is part of validation.

See the working example in [`examples/fdl-input`](../examples/fdl-input/) for
`fdl-input`, `fdl-select`, conditional validation, and a live `Record` preview.
