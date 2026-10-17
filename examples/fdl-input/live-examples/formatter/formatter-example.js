import { formattedAmountView } from './formatter-view.js';
import { formatterView as renderExample } from './formatter-view.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { ExampleModel } from './formatter-example-state.js';
import { valuePipeline } from '../../value-pipeline';
import '@pmcelhaney/fdl/lit/fdl-field';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    field(record, field) {
        return keyed(
            record.field(field),
            record === this.money
                ? renderExample([field], this.checked)
                : html`<fdl-field
                      .record=${record}
                      field=${field}
                      .showValidationErrors=${this.checked}
                  ></fdl-field>`
        );
    }
    demo() {
        return html` <div @input=${this.captureAmountInput}
                >${this.field(this.money, 'amount')}</div
            >
            ${formattedAmountView()}
            <p class="result"
                >The formatter leaves the stored number unchanged.</p
            >${valuePipeline(this.money, 'amount', this.amountInput)}`;
    }
    render() {
        return html`<div class="demo-grid"
            ><div class="controls">${this.demo()}</div
            ><fdl-record-inspector .record=${this.money}></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-formatter', ExampleView);
