import { field } from '../../../../src/index';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { ExampleModel } from './required-model.js';
import { explainDependency } from '../../dependency-explanation';
import '../../fdl-field';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    field(record, field) {
        return keyed(
            record.field(field),
            html`<fdl-field
                .record=${record}
                field=${field}
                .showValidationErrors=${this.checked}
            ></fdl-field>`
        );
    }
    demo() {
        return html` <label class="rule-control"
                ><input
                    type="checkbox"
                    .checked=${this.requiredRule}
                    @change=${event => {
                        this.requiredRule = event.target.checked;
                        const base = field.label('Legal name');
                        this.person.addField(
                            'name',
                            this.requiredRule ? base.required() : base,
                            this.person.getField('name')
                        );
                        this.requestUpdate();
                    }}
                />
                Require a value</label
            >
            ${this.field(this.person, 'name')}
            ${this.field(this.person, 'followUp')}
            ${this.field(this.person, 'followUpNotes')}
            ${explainDependency(this.person, 'followUpNotes', 'followUp', `followUp === 'yes'`, 'required')}
            <button
                class="primary"
                @click=${() => {
                    this.checked = true;
                    this.requestUpdate();
                }}
                >Check record</button
            >
            <p class="result" role="status"
                >${this.checked ? (this.person.isValid() ? '✓ The record is valid.' : !this.person.isValid('name') ? 'Legal name is required. Add a value to continue.' : 'Follow-up notes are required. Add notes or choose No.') : `${this.person.isValid() ? 'The model is valid.' : 'The model is invalid.'} Check record shows its validation message.`}</p
            >`;
    }
    render() {
        return html`<div class="demo-grid"
            ><div class="controls">${this.demo()}</div
            ><fdl-record-inspector .record=${this.person}></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-required', ExampleView);
