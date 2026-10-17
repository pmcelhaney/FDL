import { record } from './validator-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function validatorView(
    fields = ['email', 'orderQuantity', 'username'],
    showErrors = false
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
