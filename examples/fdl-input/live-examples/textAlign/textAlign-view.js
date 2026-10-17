import { ExampleModel } from './textAlign-model.js';
import { html } from 'lit';
import '../../fdl-table';
import '../../fdl-recordset-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`<p class="try"
                >The columns demonstrate left, center, and right alignment.</p
            ><fdl-table .recordset=${this.alignRecordset}
                ><fdl-column field="left"></fdl-column
                ><fdl-column field="center"></fdl-column
                ><fdl-column field="right"></fdl-column
            ></fdl-table>`;
    }
    render() {
        return html`<div class="focused full-width" data-modifier="textAlign"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-recordset-inspector
                .recordset=${this.alignRecordset}
            ></fdl-recordset-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-textalign', ExampleView);
