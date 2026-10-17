import { html } from 'lit';
import '../../fdl-table';
export function textAlignView(recordset) {
    return html`<fdl-table .recordset=${recordset}
        ><fdl-column field="left"></fdl-column
        ><fdl-column field="center"></fdl-column
        ><fdl-column field="right"></fdl-column
    ></fdl-table>`;
}
