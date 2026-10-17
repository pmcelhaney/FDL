import { aggregateView } from './reducer-view.js';
import { reducerView as renderExample } from './reducer-view.js';
import { ExampleModel } from './reducer-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`${keyed(this.probes.field('thirdAmount'), renderExample())}${aggregateView(this.reducerType)}`;
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
