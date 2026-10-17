import { ExampleModel } from './hashFunction-model.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-field';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderField(field, record, showValidationErrors = false) {
        return keyed(
            record.field(field),
            html`<fdl-field
                field=${field}
                .record=${record}
                .showValidationErrors=${showValidationErrors}
            ></fdl-field>`
        );
    }
    renderDemo() {
        return html`${this.renderField('firstId', this.probes)}${this.renderField('secondId', this.probes)}<p
                class="computed"
                role="status"
                >Hash comparison:
                ${this.hashType.valueOf().hashFunction()({ id: this.probes.getField('firstId') }) === this.hashType.valueOf().hashFunction()({ id: this.probes.getField('secondId') }) ? 'same identity' : 'different identities'}.
                Separate objects match when their IDs match.</p
            >`;
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
