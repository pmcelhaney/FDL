import { html } from 'lit';
import type Record from '../../src/record';
import type Recordset from '../../src/recordset';
import './fdl-field';
import './fdl-table';
export function learningView(
    record: Record<any>,
    fields = ['method', 'charge']
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${true}></fdl-field>`)}`;
}
export function learningTableView(recordset: Recordset<any>) {
    return html`<fdl-table .recordset=${recordset}
        ><fdl-column field="method"></fdl-column
        ><fdl-column field="charge"></fdl-column
    ></fdl-table>`;
}
