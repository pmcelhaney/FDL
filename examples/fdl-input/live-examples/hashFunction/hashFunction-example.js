import { hashComparisonView } from './hashFunction-view.js';
import { hashFunctionView as renderExample } from './hashFunction-view.js';
import { ExampleModel } from './hashFunction-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`${keyed(this.probes.field('secondId'), renderExample())}${hashComparisonView(this.hashType)}`;
    }
    render() {
        return html`<div class="focused" data-modifier="hashFunction"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><div class="focused-state"
                ><p>Stored values</p
                ><pre>${JSON.stringify(this.probes?.values)}</pre>
            </div></div
        >`;
    }
}
customElements.define('fdl-live-hashfunction', ExampleView);
