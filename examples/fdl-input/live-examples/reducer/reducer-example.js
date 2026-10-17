import { reducerView as renderExample } from './reducer-view.js';
import { ExampleModel } from './reducer-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`${keyed(this.probes.field('thirdAmount'), renderExample())}<p
                class="computed"
                role="status"
                >Sum:
                ${currency.format(this.reducerType.valueOf().aggregate(['firstAmount', 'secondAmount', 'thirdAmount'].map(field => this.probes.getField(field))))}</p
            >`;
    }
    render() {
        return html`<div class="focused" data-modifier="reducer"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector .record=${this.probes}></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-reducer', ExampleView);
