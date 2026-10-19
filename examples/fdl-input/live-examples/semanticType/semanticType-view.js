import { record } from './semanticType-model.js';
import { html } from 'lit';
import '@pmcelhaney/bizallele/lit/fdl-field';
import '@pmcelhaney/bizallele/lit/fdl-address';
export function semanticTypeView() {
    return html` <fdl-field .record=${record} field="address"></fdl-field> `;
}
