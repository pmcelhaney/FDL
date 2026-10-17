import { css, html } from 'lit';
import FormElement from './form-element';
import './fdl-address';

/**
 * A styled Lit control for an FDL field.
 *
 * FormElement resolves the field metadata, creates the configured native
 * control, and synchronizes it with the Record. This subclass supplies only
 * default styling across all supported native controls.
 */
export class FdlField extends FormElement {
    async firstUpdated() {
        if (this.record?.field(this.field).recordDefinition) return;
        await super.firstUpdated();
    }

    render() {
        const boundField = this.record?.field(this.field);
        if (boundField?.semanticType === 'address' && boundField.recordDefinition) {
            return [
                html`<fdl-address
                    .record=${this.record}
                    field=${this.field}
                    .showValidationErrors=${this.showValidationErrors}
                ></fdl-address>`,
            ];
        }
        return this.record && this.field ? super.render() : [];
    }

    static get styles() {
        return css`
            ${FormElement.styles}

            :host {
                --field-label-width: 9rem;
                --field-control-width: 18rem;
                --label: 0.875rem;
                --label-color: #475569;
                --label-font-weight: 600;
                --field-label-margin-bottom: 8px;
                --field-control-font-size: 1rem;
                margin: 0 0 16px;
            }

            input,
            select,
            textarea {
                width: 100%;
                border: 1px solid #94a3b8;
                border-radius: 6px;
                background: white;
                padding: 10px 14px;
                font: inherit;
                line-height: 1.5;
                color: #0f172a;
            }

            input,
            select {
                height: var(--fdl-control-height, 48px);
                min-height: var(--fdl-control-height, 48px);
            }

            input:focus-visible,
            select:focus-visible,
            textarea:focus-visible {
                outline: 2px solid #2563eb;
                outline-offset: 2px;
            }

            input[aria-invalid='true'],
            select[aria-invalid='true'],
            textarea[aria-invalid='true'] {
                border-color: #a42b20;
                box-shadow: inset 0 0 0 1px #a42b20;
            }

            input[type='checkbox'],
            input[type='radio'] {
                width: 1.25rem;
                height: 1.25rem;
                min-height: 0;
                padding: 0;
                accent-color: #5b52d6;
            }
            input[type='range'] {
                padding: 0;
                accent-color: #5b52d6;
            }
            input[type='color'] {
                padding: 0.25rem;
            }
            input[type='file'] {
                height: auto;
            }

            select[multiple] {
                height: auto;
                min-height: 144px;
            }
            textarea {
                resize: vertical;
            }

            .validation-error {
                margin-top: 0.35rem;
                color: #a42b20;
                font-size: 1rem;
                font-weight: 700;
                line-height: 1.4;
            }
            select:not([multiple]) {
                box-sizing: border-box;
                appearance: none;
                height: var(--fdl-control-height, 48px);
                padding: 10px 44px 10px 14px;
                border: 1px solid #94a3b8;
                border-radius: 6px;
                background-color: #fff;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='m4 6 4 4 4-4' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 14px center;
                background-size: 16px;
                color: #0f172a;
                font: inherit;
                line-height: 1.5;
            }
            @media (forced-colors: active) {
                select:not([multiple]) {
                    appearance: auto;
                    background-image: none;
                }
            }
            input:disabled,
            select:disabled,
            textarea:disabled {
                background-color: #e2e8f0;
                border-color: #94a3b8;
                border-style: dashed;
                color: #475569;
                -webkit-text-fill-color: currentColor;
                opacity: 1;
                cursor: not-allowed;
            }
        `;
    }
}

customElements.define('fdl-field', FdlField);
