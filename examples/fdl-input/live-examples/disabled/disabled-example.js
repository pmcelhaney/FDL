import { disabledView as renderExample } from './disabled-view.js';
import { ExampleModel } from './disabled-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`${keyed(this.record.field('budget'), renderExample())}`;
    }
    render() {
        return html`<div class="focused" data-modifier="disabled"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['lockedId', 'approvalStatus', 'budget']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-disabled', ExampleView);
