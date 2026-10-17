import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { ExampleModel } from './formatter-model.js';
import { valuePipeline } from '../../value-pipeline';
import '../../fdl-field';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    field(record, field) {
        return keyed(
            record.field(field),
            html`<fdl-field
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
            <div class="formatted"
                ><span>Formatted output</span
                ><strong
                    >${this.money.getFormattedField('amount', 'print')}</strong
                ></div
            >
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
