import { parserView as renderExample } from './parser-view.js';
import { ExampleModel } from './parser-example-state.js';
import { html } from 'lit';
import { valuePipeline } from '../../value-pipeline';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-field';
import '../../fdl-record-inspector';
const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderField(field, record = this.record, showValidationErrors = false) {
        return keyed(
            record.field(field),
            record === this.record
                ? renderExample(record, [field], showValidationErrors)
                : html`<fdl-field
                      field=${field}
                      .record=${record}
                      .showValidationErrors=${showValidationErrors}
                  ></fdl-field>`
        );
    }
    renderDemo() {
        return html`<p class="try"
                >Edit the money field. The stored number updates as you type;
                currency formatting is applied when you leave the field.</p
            ><div @input=${this.captureMoneyInput}
                >${this.renderField('money')}</div
            >${valuePipeline(this.record, 'money', this.moneyInput)}`;
    }
    render() {
        return html`<div class="focused" data-modifier="parser"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['money']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-parser', ExampleView);
