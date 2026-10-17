import { readOnlyView as renderExample } from './readOnly-view.js';
import { ExampleModel } from './readOnly-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`${keyed(this.record.field('conditionalOwner'), renderExample())}`;
    }
    render() {
        return html`<div class="focused" data-modifier="readOnly"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['fixedOwner', 'phase', 'conditionalOwner']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-readonly', ExampleView);
