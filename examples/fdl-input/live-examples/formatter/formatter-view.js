import { record } from './formatter-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function formatterView() {
    return html` <fdl-field .record=${record} field="amount"></fdl-field> `;
}
