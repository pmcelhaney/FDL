import { record } from './options-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function optionsView(
    fields = ['department', 'assignee', 'asyncAssignee'],
    showErrors = false
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
