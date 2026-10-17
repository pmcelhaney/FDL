import { ExampleModel } from './sortable-model.js';
import { html } from 'lit';
import '../../fdl-table';
import '../../fdl-recordset-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`<p class="try"
                >First name and Last name can sort. T-shirt size has
                .sortable(false), so its header has no sort action.</p
            ><fdl-table .recordset=${this.sortableRecordset}
                ><fdl-column field="firstName"></fdl-column
                ><fdl-column field="lastName"></fdl-column
                ><fdl-column field="shirtSize"></fdl-column
            ></fdl-table>`;
    }
    render() {
        return html`<div class="focused full-width" data-modifier="sortable"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-recordset-inspector
                .recordset=${this.sortableRecordset}
            ></fdl-recordset-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-sortable', ExampleView);
