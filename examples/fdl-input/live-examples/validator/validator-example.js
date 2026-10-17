import { validatorView as renderExample } from './validator-view.js';
import { ExampleModel } from './validator-example-state.js';
import { validatorExamples } from '../../validator-examples';
import { html, nothing } from 'lit';
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
            record === this.record
                ? renderExample(record, [field], showValidationErrors)
                : html`<fdl-field
                      field=${field}
                      .record=${record}
                      .showValidationErrors=${showValidationErrors}
                  ></fdl-field>`
        );
    }
    validationResult(field) {
        if (!this.validatedFields.has(field) || !this.record.isValid(field))
            return nothing;
        return html`<p class="result valid" role="status">Valid.</p>`;
    }
    renderValidation(field, buttonText = 'Check value') {
        const showValidationErrors = this.validatedFields.has(field);
        return html`${this.renderField(field, this.record, showValidationErrors)}
            <button type="button" @click=${() => this.validateField(field)}
                >${buttonText}</button
            >
            ${this.validationResult(field)}`;
    }
    renderDemo() {
        return html`${validatorExamples.map(
            example =>
                html`<section class="validator-example">
                    <h3>${example.title}</h3><p>${example.hint}</p>
                    ${this.renderValidation(example.field, example.button)}
                </section>`
        )}`;
    }
    render() {
        return html`<div class="focused" data-modifier="validator"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['email', 'orderQuantity', 'username']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-validator', ExampleView);
