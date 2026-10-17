import { ExampleModel } from './type-model.js';
import { inputTypeNote } from '../../input-type-example';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-field';
import '../../fdl-record-inspector';
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
        return html`${this.renderField('inputType', this.probes)}
            <p class="try"
                >${inputTypeNote(this.probes.getField('inputType'))}</p
            >
            ${this.renderField('inputValue', this.inputTypeRecord)}`;
    }
    render() {
        return html`<div class="focused" data-modifier="type"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.inputTypeRecord}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-type', ExampleView);
