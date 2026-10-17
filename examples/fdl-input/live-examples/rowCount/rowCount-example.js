import { rowCountView as renderExample } from './rowCount-view.js';
import { ExampleModel } from './rowCount-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '@pmcelhaney/fdl/lit/fdl-field';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderField(field, record = this.record, showValidationErrors = false) {
        return keyed(
            record.field(field),
            record === this.record
                ? renderExample([field], showValidationErrors)
                : html`<fdl-field
                      field=${field}
                      .record=${record}
                      .showValidationErrors=${showValidationErrors}
                  ></fdl-field>`
        );
    }
    renderDemo() {
        return html`${this.renderField('textareaRows', this.probes)}${this.renderField('comments')}`;
    }
    render() {
        return html`<div class="focused" data-modifier="rowCount"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['comments']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-rowcount', ExampleView);
