import { ExampleModel } from './reducer-model.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-field';
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
            html`<fdl-field
                field=${field}
                .record=${record}
                .showValidationErrors=${showValidationErrors}
            ></fdl-field>`
        );
    }
    renderDemo() {
        return html`${['firstAmount', 'secondAmount', 'thirdAmount'].map(field => this.renderField(field, this.probes))}<p
                class="computed"
                role="status"
                >Sum:
                ${currency.format(this.reducerType.valueOf().aggregate([this.probes.getField('firstAmount'), this.probes.getField('secondAmount'), this.probes.getField('thirdAmount')]))}</p
            >`;
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
