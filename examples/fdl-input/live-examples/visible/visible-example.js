import { visibleView as renderExample } from './visible-view.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { ExampleModel } from './visible-example-state.js';
import { explainDependency } from '../../dependency-explanation';
import '@pmcelhaney/fdl/lit/fdl-field';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    field(record, field) {
        return keyed(
            record.field(field),
            record === this.delivery
                ? renderExample(record, [field], this.checked)
                : html`<fdl-field
                      .record=${record}
                      field=${field}
                      .showValidationErrors=${this.checked}
                  ></fdl-field>`
        );
    }
    demo() {
        return html`${this.field(this.delivery, 'fulfillment')}${this.field(this.delivery, 'address')}${explainDependency(this.delivery, 'address', 'fulfillment', `fulfillment === 'ship'`, 'visible')}<p
                class="result"
                role="status"
                >${this.delivery.getField('fulfillment') === 'ship' ? 'Shipping address is visible.' : 'Pickup selected. Shipping address is hidden.'}</p
            >`;
    }
    render() {
        return html`<div class="demo-grid"
            ><div class="controls">${this.demo()}</div
            ><fdl-record-inspector
                .record=${this.delivery}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-visible', ExampleView);
