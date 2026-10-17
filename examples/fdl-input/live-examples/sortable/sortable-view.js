import { html } from 'lit';
import '../../fdl-table';
export function sortableView(recordset) {
    return html`<fdl-table .recordset=${recordset}
        ><fdl-column field="firstName"></fdl-column
        ><fdl-column field="lastName"></fdl-column
        ><fdl-column field="shirtSize"></fdl-column
    ></fdl-table>`;
}
