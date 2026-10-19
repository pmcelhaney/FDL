import { html } from 'lit';
import type { Record } from '@pmcelhaney/bizallele';
import '@pmcelhaney/bizallele/lit/fdl-field';
import '@pmcelhaney/bizallele/lit/fdl-record';

export function cancellationView(record: Record<any>) {
    return html`<fdl-record .record=${record}>
        <fdl-field field="status"></fdl-field>
        <fdl-field field="reason"></fdl-field>
    </fdl-record>`;
}
