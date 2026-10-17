import { aggregateView } from './reducer-view.js';
import { reducerView as renderExample } from './reducer-view.js';
import { ExampleModel } from './reducer-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '@pmcelhaney/fdl/lit/fdl-field';
const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderField(field, record, showValidationErrors = false) {
        return keyed(
            record.field(field),
            record === this.probes
                ? renderExample(record, [field], showValidationErrors)
                : html`<fdl-field
                      field=${field}
                      .record=${record}
                      .showValidationErrors=${showValidationErrors}
                  ></fdl-field>`
        );
    }
    renderDemo() {
        return html`${['firstAmount', 'secondAmount', 'thirdAmount'].map(field => this.renderField(field, this.probes))}${aggregateView(this.probes, this.reducerType)}`;
    }
    render() {
        return html`<div class="focused" data-modifier="reducer"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><div class="focused-state"
                ><p>Stored values</p
                ><pre>
${JSON.stringify({ values: this.probes.values, sum: this.reducerType.valueOf().aggregate(['firstAmount', 'secondAmount', 'thirdAmount'].map(field => this.probes.getField(field))) })}</pre>
            </div></div
        >`;
    }
}
customElements.define('fdl-live-reducer', ExampleView);
