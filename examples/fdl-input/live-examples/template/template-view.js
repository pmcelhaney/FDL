import { ExampleModel } from './template-model.js';
import { html } from 'lit';
import '../../fdl-table';
import '../../fdl-recordset-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html` <fdl-table .recordset=${this.templateRecordset}
            ><fdl-column field="invoice"></fdl-column
            ><fdl-column field="balance"></fdl-column
        ></fdl-table>`;
    }
    render() {
        return html`<div class="focused full-width" data-modifier="template"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-recordset-inspector
                .recordset=${this.templateRecordset}
            ></fdl-recordset-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-template', ExampleView);
