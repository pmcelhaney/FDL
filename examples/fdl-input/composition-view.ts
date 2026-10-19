import { html } from 'lit';
import type { Record } from '@pmcelhaney/bizallele';
import '@pmcelhaney/bizallele/lit/fdl-field';
import '@pmcelhaney/bizallele/lit/fdl-record';

export function compositionView(record: Record<any>) {
    return html`<fdl-record .record=${record}>
        <fdl-field field="fulfillment"></fdl-field>
        <fdl-field field="address"></fdl-field>
    </fdl-record>`;
}
