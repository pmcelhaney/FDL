import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function readOnlyView(
    record,
    fields = ['fixedOwner', 'phase', 'conditionalOwner'],
    showErrors = false
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
