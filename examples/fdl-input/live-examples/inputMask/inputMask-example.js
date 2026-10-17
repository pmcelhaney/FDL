import { inputMaskView as renderExample } from './inputMask-view.js';
import { ExampleModel } from './inputMask-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`${keyed(this.probes.field('input'), renderExample())}`;
    }
    render() {
        return html`<div class="focused" data-modifier="inputMask"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .fields=${['input']}
                .record=${this.probes}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-inputmask', ExampleView);
