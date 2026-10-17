import { html } from 'lit';
import '../../fdl-table';
export function columnWidthsView(recordset) {
    return html`<fdl-table .recordset=${recordset} show-width-diagnostics
        ><fdl-column field="constrained"></fdl-column
        ><fdl-column field="flexible"></fdl-column
    ></fdl-table>`;
}
