import { record } from './record-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
import '@pmcelhaney/fdl/lit/fdl-address';
export function recordView() {
    return html` <fdl-field .record=${record} field="address"></fdl-field> `;
}
