import { html } from 'lit';
import type { Record } from '@pmcelhaney/fdl';
import '@pmcelhaney/fdl/lit/fdl-field';

export function cancellationView(record: Record<any>) {
    return html`
        <fdl-field .record=${record} field="status"></fdl-field>
        <fdl-field .record=${record} field="reason"></fdl-field>
    `;
}
