import { html } from 'lit';
import '../../fdl-field';
export function visibleView(
    record,
    fields = ['fulfillment', 'address'],
    showErrors = false
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
