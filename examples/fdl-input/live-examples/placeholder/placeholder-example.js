import { placeholderView as renderExample } from './placeholder-view.js';
import { ExampleModel } from './placeholder-example-state.js';
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
                ? renderExample(record, [field], showValidationErrors)
                : html`<fdl-field
                      field=${field}
                      .record=${record}
                      .showValidationErrors=${showValidationErrors}
                  ></fdl-field>`
        );
    }
    renderDemo() {
        return html`${this.renderField('projectName')}`;
    }
    render() {
        return html`<div class="focused" data-modifier="placeholder"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['projectName']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-placeholder', ExampleView);
