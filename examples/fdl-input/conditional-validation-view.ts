import { html } from 'lit';
import type Record from '../../src/record';
import './fdl-field';

export function conditionalValidationView(
    record: Record<any>,
    fields: string[] = ['country', 'taxId']
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${true}></fdl-field>`)}`;
}
