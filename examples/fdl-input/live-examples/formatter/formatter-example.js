import { formatterView as renderExample } from './formatter-view.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { ExampleModel } from './formatter-example-state.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    demo() {
        return html`${keyed(this.money.field('amount'), renderExample())}
            <div class="formatted"
                ><span>Formatted output</span
                ><strong
                    >${this.money.getFormattedField('amount', 'print')}</strong
                ></div
            >`;
    }
    render() {
        return html`<div class="demo-grid"
            ><div class="controls">${this.demo()}</div
            ><fdl-record-inspector .record=${this.money}></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-formatter', ExampleView);
