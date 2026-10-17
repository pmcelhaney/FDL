import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function rowCountView(
    record,
    fields = ['comments'],
    showErrors = false
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
