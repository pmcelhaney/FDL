import { html } from 'lit';
import type { Record } from '@pmcelhaney/fdl';
import type { Recordset } from '@pmcelhaney/fdl';
import '@pmcelhaney/fdl/lit/fdl-field';
import '@pmcelhaney/fdl/lit/fdl-table';
export function learningView(record: Record<any>, step = 3) {
    return html`
        ${step >= 3 ? html`<fdl-field .record=${record} field="method"></fdl-field>` : ''}
        <fdl-field .record=${record} field="charge"></fdl-field>
    `;
}
export function learningTableView(recordset: Recordset<any>) {
    return html`<fdl-table .recordset=${recordset}
        ><fdl-column field="method"></fdl-column
        ><fdl-column field="charge"></fdl-column
    ></fdl-table>`;
}
