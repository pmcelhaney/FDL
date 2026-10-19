import { html } from 'lit';
import type { Record } from '@pmcelhaney/bizallele';
import '@pmcelhaney/bizallele/lit/fdl-field';
import '@pmcelhaney/bizallele/lit/fdl-record';

export function conditionalValidationView(record: Record<any>) {
    return html`<fdl-record .record=${record}>
        <fdl-field field="country"></fdl-field>
        <fdl-field field="taxId"></fdl-field>
    </fdl-record>`;
}
