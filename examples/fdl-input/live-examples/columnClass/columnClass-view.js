import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-table';
export function columnClassView(recordset) {
    return html`<fdl-table .recordset=${recordset}
        ><fdl-column field="day"></fdl-column
        ><fdl-column field="amount"></fdl-column
    ></fdl-table>`;
}
