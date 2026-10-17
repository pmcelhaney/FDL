import { record } from './inputMask-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function inputMaskView() {
    return html` <fdl-field .record=${record} field="input"></fdl-field> `;
}
