import { ExampleModel } from './cellClass-model.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-field';
import '../../fdl-table';
import '../../fdl-recordset-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderField(field, record, showValidationErrors = false) {
        return keyed(
            record.field(field),
            html`<fdl-field
                field=${field}
                .record=${record}
                .showValidationErrors=${showValidationErrors}
            ></fdl-field>`
        );
    }
    renderDemo() {
        return html`${this.renderField('classThreshold', this.probes)}<fdl-table
                .recordset=${this.cellClassRecordset}
                ><fdl-column field="day"></fdl-column
                ><fdl-column field="amount"></fdl-column
            ></fdl-table>`;
    }
    render() {
        return html`<div class="focused full-width" data-modifier="cellClass"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-recordset-inspector
                .recordset=${this.cellClassRecordset}
            ></fdl-recordset-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-cellclass', ExampleView);
