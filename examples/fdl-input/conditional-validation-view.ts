import { html } from 'lit';
import type { Record } from '@pmcelhaney/fdl';
import '@pmcelhaney/fdl/lit/fdl-field';

export function conditionalValidationView(record: Record<any>) {
    return html`
        <fdl-field .record=${record} field="country"></fdl-field>
        <fdl-field .record=${record} field="taxId"></fdl-field>
    `;
}
