import { hashFunctionView as renderExample } from './hashFunction-view.js';
import { ExampleModel } from './hashFunction-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`${keyed(this.probes.field('secondId'), renderExample())}<p
                class="computed"
                role="status"
                >Hash comparison:
                ${this.hashType.valueOf().hashFunction()({ id: this.probes.getField('firstId') }) === this.hashType.valueOf().hashFunction()({ id: this.probes.getField('secondId') }) ? 'same identity' : 'different identities'}.</p
            >`;
    }
    render() {
        return html`<div class="focused" data-modifier="hashFunction"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector .record=${this.probes}></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-hashfunction', ExampleView);
