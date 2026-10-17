import { recordView as renderExample } from './record-view.js';
import { ExampleModel } from './record-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-field';
import '../../fdl-address';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderField(field, record = this.record, showValidationErrors = false) {
        return keyed(
            record.field(field),
            record === this.record
                ? renderExample(record, [field], showValidationErrors)
                : html`<fdl-field
                      field=${field}
                      .record=${record}
                      .showValidationErrors=${showValidationErrors}
                  ></fdl-field>`
        );
    }
    renderDemo() {
        return html`<p class="try"
                >The generic <code>&lt;fdl-field&gt;</code> delegates this
                address value to <code>&lt;fdl-address&gt;</code>. Edit a child
                field and inspect the parent value below.</p
            >${this.renderField('address')}
            <pre class="composite-value">
${JSON.stringify(this.record.getField('address'), null, 2)}</pre>`;
    }
    render() {
        return html`<div class="focused" data-modifier="record"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['address']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-record', ExampleView);
