import { ExampleModel } from './label-model.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-field';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderField(field, record = this.record, showValidationErrors = false) {
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
        return html`<p class="try"
                >Change the expense type and watch the amount label.</p
            >${this.renderField('expenseType')}${this.renderField('dynamicAmount')}`;
    }
    render() {
        return html`<div class="focused" data-modifier="label"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['expenseType', 'dynamicAmount']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-label', ExampleView);
