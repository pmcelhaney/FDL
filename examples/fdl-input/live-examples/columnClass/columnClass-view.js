import { ExampleModel } from './columnClass-model.js';
import { html } from 'lit';
import '../../fdl-table';
import '../../fdl-recordset-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`<p class="try"
                >The Expenses column shares its classes across the column,
                heading, and cells. Only the value above 100 adds the
                cell-specific high-value class.</p
            ><fdl-table .recordset=${this.columnClassRecordset}
                ><fdl-column field="day"></fdl-column
                ><fdl-column field="amount"></fdl-column
            ></fdl-table>`;
    }
    render() {
        return html`<div class="focused full-width" data-modifier="columnClass"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-recordset-inspector
                .recordset=${this.columnClassRecordset}
            ></fdl-recordset-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-columnclass', ExampleView);
