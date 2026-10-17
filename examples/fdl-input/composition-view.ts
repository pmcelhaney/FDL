import { html } from 'lit';
import type { Record } from '@pmcelhaney/fdl';
import './fdl-field';

export function compositionView(
    record: Record<any>,
    fields: string[] = ['fulfillment', 'address']
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${true}></fdl-field>`)}`;
}
