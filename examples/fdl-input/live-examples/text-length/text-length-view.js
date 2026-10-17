import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function textLengthView(record, showErrors = false) {
    return html`<fdl-field
        .record=${record}
        field="code"
        .showValidationErrors=${showErrors}
    ></fdl-field>`;
}
