import { html } from 'lit';
import '../../fdl-field';
export function inputMaskView(record, fields = ['input'], showErrors = false) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}
