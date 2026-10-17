import { defaultValueView as renderExample } from './defaultValue-view.js';
import { ExampleModel } from './defaultValue-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`${keyed(this.defaultRecord.field('documentTitle'), renderExample())}<button
                type="button"
                @click=${this.clearDefaultRecord}
                >Clear the record</button
            >`;
    }
    render() {
        return html`<div class="focused" data-modifier="defaultValue"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.defaultRecord}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-defaultvalue', ExampleView);
