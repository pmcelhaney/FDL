import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-table';
export function templateView(recordset) {
    return html`<fdl-table .recordset=${recordset}
        ><fdl-column field="invoice"></fdl-column
        ><fdl-column field="balance"></fdl-column
    ></fdl-table>`;
}
