import { record } from './visible-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function visibleView(
    fields = ['fulfillment', 'address'],
    showErrors = false
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
