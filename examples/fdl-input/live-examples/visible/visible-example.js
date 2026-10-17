import { visibleView as renderExample } from './visible-view.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { ExampleModel } from './visible-example-state.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    demo() {
        return html`${keyed(this.delivery.field('address'), renderExample())}`;
    }
    render() {
        return html`<div class="demo-grid"
            ><div class="controls">${this.demo()}</div
            ><fdl-record-inspector
                .record=${this.delivery}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-visible', ExampleView);
