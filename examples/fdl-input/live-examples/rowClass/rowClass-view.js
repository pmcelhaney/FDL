import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-table';
export function rowClassView(recordset) {
    return html`<fdl-table .recordset=${recordset}
        ><fdl-column field="status"></fdl-column
        ><fdl-column field="owner"></fdl-column
    ></fdl-table>`;
}
