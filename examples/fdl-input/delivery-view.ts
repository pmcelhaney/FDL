import { html } from 'lit';
import type { Record } from '@pmcelhaney/fdl';
import './fdl-field';

export function deliveryView(
    record: Record<any>,
    fields: string[] = [
        'fulfillment',
        'address',
        'city',
        'state',
        'zip',
        'store',
    ]
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${true} select-prompt=${field === 'store' ? 'Select a store' : undefined}></fdl-field>`)}`;
}
