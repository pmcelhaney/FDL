import { emptyWhenView as renderExample } from './emptyWhen-view.js';
import { ExampleModel } from './emptyWhen-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`<p class="try"
                >Both fields treat “N/A” as empty. Reference is required;
                Optional reference can be left empty.</p
            >${keyed(this.record.field('optionalEmptyCode'), renderExample())}`;
    }
    render() {
        return html`<div class="focused" data-modifier="emptyWhen"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['emptyCode', 'optionalEmptyCode']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-emptywhen', ExampleView);
