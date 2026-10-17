import { cellClassView as renderExample } from './cellClass-view.js';
import { ExampleModel } from './cellClass-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '@pmcelhaney/fdl/lit/fdl-field';
import '@pmcelhaney/fdl/lit/fdl-table';
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
        return html`${this.renderField('classThreshold', this.probes)}${renderExample(this.cellClassRecordset)}`;
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
