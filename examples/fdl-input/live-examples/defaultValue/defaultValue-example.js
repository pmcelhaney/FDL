import { defaultValueView as renderExample } from './defaultValue-view.js';
import { ExampleModel } from './defaultValue-example-state.js';
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
            record === this.defaultRecord
                ? renderExample(record, [field], showValidationErrors)
                : html`<fdl-field
                      field=${field}
                      .record=${record}
                      .showValidationErrors=${showValidationErrors}
                  ></fdl-field>`
        );
    }
    renderDemo() {
        return html`${this.renderField('documentTitle', this.defaultRecord)}<button
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
