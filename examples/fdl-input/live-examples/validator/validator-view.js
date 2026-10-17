import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function validatorView(
    record,
    fields = ['email', 'orderQuantity', 'username'],
    showErrors = false
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
