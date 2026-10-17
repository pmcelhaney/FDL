import { placeholderView as renderExample } from './placeholder-view.js';
import { ExampleModel } from './placeholder-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`${keyed(this.record.field('projectName'), renderExample())}`;
    }
    render() {
        return html`<div class="focused" data-modifier="placeholder"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['projectName']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-placeholder', ExampleView);
