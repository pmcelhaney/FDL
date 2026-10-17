import { readOnlyView as renderExample } from './readOnly-view.js';
import { ExampleModel } from './readOnly-example-state.js';
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
        return html`${this.renderField('fixedOwner')}${this.renderField('phase')}${this.renderField('conditionalOwner')}${explainDependency(this.record, 'conditionalOwner', 'phase', `phase === 'submitted'`, 'readonly')}`;
    }
    render() {
        return html`<div class="focused" data-modifier="readOnly"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['fixedOwner', 'phase', 'conditionalOwner']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-readonly', ExampleView);
