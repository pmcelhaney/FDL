import { validatorView as renderExample } from './validator-view.js';
import { ExampleModel } from './validator-example-state.js';
import { html } from 'lit';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return renderExample();
    }
    render() {
        return html`<div class="focused" data-modifier="validator"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['email', 'orderQuantity', 'username']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-validator', ExampleView);
