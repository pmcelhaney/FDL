import { record } from './multipleValues-model.js';
import { html } from 'lit';
import '@pmcelhaney/bizallele/lit/fdl-field';
export function multipleValuesView() {
    return html` <fdl-field .record=${record} field="skills"></fdl-field> `;
}
