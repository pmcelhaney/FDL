import { ExampleModel } from './rowClass-model.js';
import { html } from 'lit';
import '../../fdl-table';
import '../../fdl-recordset-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`<p class="try"
                >Every row receives <code>invoice-row</code>. The Disputed row
                also receives <code>disputed-row</code> and
                <code>needs-review</code>.</p
            ><fdl-table .recordset=${this.rowClassRecordset}
                ><fdl-column field="status"></fdl-column
                ><fdl-column field="owner"></fdl-column
            ></fdl-table>`;
    }
    render() {
        return html`<div class="focused full-width" data-modifier="rowClass"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-recordset-inspector
                .recordset=${this.rowClassRecordset}
            ></fdl-recordset-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-rowclass', ExampleView);
