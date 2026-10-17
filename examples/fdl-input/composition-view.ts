import { html } from 'lit';
import type { Record } from '@pmcelhaney/fdl';
import '@pmcelhaney/fdl/lit/fdl-field';

export function compositionView(record: Record<any>) {
    return html`
        <fdl-field .record=${record} field="fulfillment"></fdl-field>
        <fdl-field .record=${record} field="address"></fdl-field>
    `;
}
