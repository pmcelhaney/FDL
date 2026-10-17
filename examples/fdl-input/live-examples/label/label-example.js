import { labelView as renderExample } from './label-view.js';
import { ExampleModel } from './label-example-state.js';
import { html } from 'lit';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`<p class="try"
                >Change the expense type and watch the amount label.</p
            >${renderExample(this.record)}`;
    }
    render() {
        return html`<div class="focused" data-modifier="label"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['expenseType', 'dynamicAmount']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-label', ExampleView);
