import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-table';
export function compareFunctionView(recordset) {
    return html`<fdl-table .recordset=${recordset}>
        <fdl-column field="firstName"></fdl-column>
        <fdl-column field="lastName"></fdl-column>
        <fdl-column field="shirtSize"></fdl-column>
    </fdl-table>`;
}
