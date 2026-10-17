import { record } from './type-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function typeView() {
    return html` <fdl-field .record=${record} field="inputValue"></fdl-field> `;
}
