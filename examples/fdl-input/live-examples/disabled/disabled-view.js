import { record } from './disabled-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function disabledView(
    fields = ['lockedId', 'approvalStatus', 'budget'],
    showErrors = false
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
