import { ExampleModel } from './minLength-model.js';
import { field } from '../../../../src/index';
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
        return html`<label
                >Minimum length
                <select
                    class="minimum-rule"
                    .value=${String(this.minimum)}
                    @change=${event => {
                        this.minimum = Number(event.target.value);
                        this.record.addField(
                            'longCode',
                            field.label('Access code').minLength(this.minimum),
                            this.record.getField('longCode')
                        );
                        this.dispatchEvent(
                            new CustomEvent('example-settings-change', {
                                detail: { minimum: this.minimum },
                                bubbles: true,
                                composed: true,
                            })
                        );
                        this.requestUpdate();
                    }}
                    >${[2, 4, 8].map(value => html`<option value=${value} ?selected=${value === this.minimum}>${value} characters</option>`)}</select
                ></label
            >${this.renderValidation('longCode')}`;
    }
    render() {
        return html`<div class="focused" data-modifier="minLength"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['longCode']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-minlength', ExampleView);
