import { html } from 'lit';
import type Record from '../../src/record';
import './fdl-field';

export function specializationView(
    record: Record<any>,
    fields: string[] = ['base', 'required', 'sibling']
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${true}></fdl-field>`)}`;
}
