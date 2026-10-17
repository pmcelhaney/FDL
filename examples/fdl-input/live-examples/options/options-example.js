import { optionsView as renderExample } from './options-view.js';
import { ExampleModel } from './options-example-state.js';
import { html, nothing } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '@pmcelhaney/fdl/lit/fdl-field';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    selectionExplanation() {
        return html`<div class="selection-explanation" role="status">
            <p
                >Margaret Hamilton appears in both departments. Switching
                departments keeps her selected.</p
            >
            <p
                >Available choices:
                ${this.optionsLoading ? 'Loading…' : this.assigneeChoices.map(choice => `${choice.text} (${choice.value})`).join(', ')}.</p
            >
            ${['assignee', 'asyncAssignee'].map(field => {
                const selected = this.record.getField(field);
                const matches = this.assigneeChoices.some(
                    choice => choice.value === selected
                );
                return html`<div data-selection=${field}>
                    <p
                        >${field === 'assignee' ? 'Function' : 'Async function'}
                        stored selection:
                        <code>${selected || '(empty)'}</code>.</p
                    >
                    ${this.optionsLoading ? nothing : html`<p>${!selected ? 'No assignee is selected. The record automatically clears selections that are no longer available.' : matches ? 'The stored assignee is among the available choices and is not reset when the list changes.' : 'The stored assignee is no longer among the available choices. The record clears an unavailable selection when the latest choices finish loading.'}</p>`}
                    <button
                        class="clear-selection"
                        ?disabled=${!selected || this.optionsLoading}
                        @click=${() => this.record.setField(field, '')}
                        >Clear
                        ${field === 'assignee' ? 'function' : 'async function'}
                        selection</button
                    >
                </div>`;
            })}
        </div>`;
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
                >Change Department; Assignee choices refresh.</p
            >${this.renderField('department')}${this.renderField('assignee')}${this.renderField('asyncAssignee')}${this.selectionExplanation()}`;
    }
    render() {
        return html`<div class="focused" data-modifier="options"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['department', 'assignee', 'asyncAssignee']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-options', ExampleView);
