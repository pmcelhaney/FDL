import { multipleValuesView as renderExample } from './multipleValues-view.js';
import { ExampleModel } from './multipleValues-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`<p class="try"
                >Open the Skills dropdown and check any combination.</p
            >${keyed(this.record.field('skills'), renderExample())}`;
    }
    render() {
        return html`<div class="focused" data-modifier="multipleValues"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['skills']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-multiplevalues', ExampleView);
