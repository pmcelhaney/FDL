import { parserView as renderExample } from './parser-view.js';
import { ExampleModel } from './parser-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderDemo() {
        return html`<p class="try"
                >Edit the money field. The stored number updates as you type;
                currency formatting is applied when you leave the field.</p
            ><div>${keyed(this.record.field('money'), renderExample())}</div>`;
    }
    render() {
        return html`<div class="focused" data-modifier="parser"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['money']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-parser', ExampleView);
