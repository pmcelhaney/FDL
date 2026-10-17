import { recordset } from './textAlign-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-table';
export function textAlignView() {
    return html`<fdl-table .recordset=${recordset}
        ><fdl-column field="left"></fdl-column
        ><fdl-column field="center"></fdl-column
        ><fdl-column field="right"></fdl-column
    ></fdl-table>`;
}
