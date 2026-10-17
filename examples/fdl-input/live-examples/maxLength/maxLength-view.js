import { ExampleModel } from './maxLength-model.js';
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
            html`<fdl-field
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
        return html`${this.renderValidation('shortCode')}${
            this.modifier
                ? html`<button
                      class="model-assignment"
                      @click=${() => {
                          this.record.setField(
                              'shortCode',
                              'THIS-CODE-IS-TOO-LONG'
                          );
                          this.validateField('shortCode');
                      }}
                      >Assign an overlong model value</button
                  >`
                : nothing
        }`;
    }
    render() {
        return html`<div class="focused" data-modifier="maxLength"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['shortCode']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-maxlength', ExampleView);
