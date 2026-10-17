import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function formatterView(record, fields = ['amount'], showErrors = false) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}

export function formattedAmountView(record) {
    return html`<div class="formatted"
        ><span>Formatted output</span
        ><strong>${record.getFormattedField('amount', 'print')}</strong></div
    >`;
}
