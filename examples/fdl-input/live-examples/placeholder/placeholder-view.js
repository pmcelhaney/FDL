import { record } from './placeholder-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function placeholderView(fields = ['projectName'], showErrors = false) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
