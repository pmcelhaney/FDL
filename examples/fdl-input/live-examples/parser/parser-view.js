import { record } from './parser-model.js';
import { html } from 'lit';
import '@pmcelhaney/bizallele/lit/fdl-field';
export function parserView() {
    return html` <fdl-field .record=${record} field="money"></fdl-field> `;
}
