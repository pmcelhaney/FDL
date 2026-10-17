import { hashComparisonView } from './hashFunction-view.js';
import { hashFunctionView as renderExample } from './hashFunction-view.js';
import { ExampleModel } from './hashFunction-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '@pmcelhaney/fdl/lit/fdl-field';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderField(field, record, showValidationErrors = false) {
        return keyed(
            record.field(field),
            record === this.probes
                ? renderExample([field], showValidationErrors)
                : html`<fdl-field
                      field=${field}
                      .record=${record}
                      .showValidationErrors=${showValidationErrors}
                  ></fdl-field>`
        );
    }
    renderDemo() {
        return html`${this.renderField('firstId', this.probes)}${this.renderField('secondId', this.probes)}${hashComparisonView(this.hashType)}`;
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
