import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { field } from '../../../../src/index';
import { ExampleController } from '../../example-controller';
import { explainDependency } from '../../dependency-explanation';
import { createPerson } from './required-model.js';
import { requiredView } from './required-view.js';
import '../../fdl-record-inspector';

// Documentation controls surround the small model/view example without
// becoming part of the source that teaches rendering an FDL record.
export class RequiredExample extends ExampleController {
    person = createPerson();
    checked = false;
    requiredRule = true;

    createRenderRoot() {
        return this;
    }

    setRequired(required) {
        this.requiredRule = required;
        const base = field.label('Legal name');
        this.person.addField(
            'name',
            required ? base.required() : base,
            this.person.getField('name')
        );
        this.requestUpdate();
    }

    checkRecord() {
        this.checked = true;
        this.requestUpdate();
    }

    status() {
        if (!this.checked) {
            return `${this.person.isValid() ? 'The model is valid.' : 'The model is invalid.'} Check record shows its validation message.`;
        }
        if (this.person.isValid()) return '✓ The record is valid.';
        if (!this.person.isValid('name')) {
            return 'Legal name is required. Add a value to continue.';
        }
        return 'Follow-up notes are required. Add notes or choose No.';
    }

    render() {
        return html`<div class="demo-grid">
            <div class="controls">
                <label class="rule-control">
                    <input
                        type="checkbox"
                        .checked=${this.requiredRule}
                        @change=${event => this.setRequired(event.target.checked)}
                    />
                    Require a value
                </label>
                ${keyed(this.person.field('name'), requiredView(this.person, this.checked))}
                ${explainDependency(this.person, 'followUpNotes', 'followUp', "followUp === 'yes'", 'required')}
                <button class="primary" @click=${() => this.checkRecord()}
                    >Check record</button
                >
                <p class="result" role="status">${this.status()}</p>
            </div>
            <fdl-record-inspector .record=${this.person}></fdl-record-inspector>
        </div>`;
    }
}
customElements.define('fdl-live-required', RequiredExample);
