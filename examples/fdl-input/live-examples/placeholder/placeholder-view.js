import { record } from './placeholder-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function placeholderView() {
    return html`
        <fdl-field .record=${record} field="projectName"></fdl-field>
    `;
}
