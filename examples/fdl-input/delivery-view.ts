import { html } from 'lit';
import type { Record } from '@pmcelhaney/fdl';
import '@pmcelhaney/fdl/lit/fdl-field';

export function deliveryView(record: Record<any>) {
    return html`
        <fdl-field .record=${record} field="fulfillment"></fdl-field>
        <fdl-field .record=${record} field="address"></fdl-field>
        <fdl-field .record=${record} field="pickupZip"></fdl-field>
        <fdl-field
            .record=${record}
            field="store"
            select-prompt="Select a store"
        ></fdl-field>
    `;
}
