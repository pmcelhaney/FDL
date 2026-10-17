import { html } from 'lit';
import '../../fdl-table';
export function cellClassView(recordset) {
    return html`<fdl-table .recordset=${recordset}
        ><fdl-column field="day"></fdl-column
        ><fdl-column field="amount"></fdl-column
    ></fdl-table>`;
}
