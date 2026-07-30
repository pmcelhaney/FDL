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

## A unified field component

Applications should expose one field custom element and let `FormElement`
create the native control named by the field metadata. Preserve the base
stylesheet by overriding its static getter, not by assigning a static class
field:

```ts
import { css } from 'lit';
import FormElement from '../form-element';

export class FdlField extends FormElement {
  static get styles() {
    return css`
      ${FormElement.styles}

      input, select, textarea {
        border: 1px solid #9ca3af;
        border-radius: 0.25rem;
        padding: 0.5rem;
      }
    `;
  }
}

customElements.define('fdl-field', FdlField);
```

Always use that component as the outer form control and pass the record and
field. The `FieldType` tag names the native child created inside it:

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
html`<fdl-field field="contactMethod" .record=${record}></fdl-field>`
```

Do not create separate `<fdl-input>`, `<fdl-select>`, or `<fdl-textarea>` APIs.
Use `tag('input')`, `tag('select')`, or `tag('textarea')` in the field metadata
and keep `<fdl-field>` stable at the call site.

## Native dropdowns

For a native `select`, `FormElement` converts the option objects returned by
`.options(...)` into `<option>` nodes. Each option should provide `text` and
`value` (or use the documented `options({ data, text, value })` mapping).
Include an empty option when the field starts empty, and use `.required()` or
`.requiredWhen(...)` if choosing an option is part of validation.

See the working example in [`examples/fdl-input`](../examples/fdl-input/) for
the unified `fdl-field`, conditional validation, and a live `Record` preview.
