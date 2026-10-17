import { emptyWhenView as renderExample } from './emptyWhen-view.js';
import { ExampleModel } from './emptyWhen-example-state.js';
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
        return html`<p class="try"
                >Both fields treat “N/A” as empty. Reference is required;
                Optional reference can be left empty.</p
            >${['emptyCode', 'optionalEmptyCode'].map(
                field =>
                    html` ${this.renderField(field)}
                        <p class="computed" role="status" data-field=${field}>
                            ${this.record.field(field).empty ? 'This field is considered empty' : 'This field is not considered empty'}<br />
                            ${!this.record.isValid(field) ? 'Invalid: Reference is required.' : field === 'optionalEmptyCode' ? 'Valid: this field is optional.' : 'Valid: a reference has been provided.'}
                        </p>`
            )}`;
    }
    render() {
        return html`<div class="focused" data-modifier="emptyWhen"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['emptyCode', 'optionalEmptyCode']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-emptywhen', ExampleView);
