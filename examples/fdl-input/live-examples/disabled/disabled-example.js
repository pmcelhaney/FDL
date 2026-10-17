import { disabledView as renderExample } from './disabled-view.js';
import { ExampleModel } from './disabled-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { explainDependency } from '../../dependency-explanation';
import '../../fdl-field';
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
        return html`${this.renderField('lockedId')}${this.renderField('approvalStatus')}${this.renderField('budget')}${explainDependency(this.record, 'budget', 'approvalStatus', `approvalStatus === 'approved'`, 'disabled')}`;
    }
    render() {
        return html`<div class="focused" data-modifier="disabled"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['lockedId', 'approvalStatus', 'budget']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-disabled', ExampleView);
