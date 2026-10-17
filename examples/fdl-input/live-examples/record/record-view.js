import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
import '@pmcelhaney/fdl/lit/fdl-address';
export function recordView(record, fields = ['address'], showErrors = false) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
