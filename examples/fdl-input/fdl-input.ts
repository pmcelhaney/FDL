import { css } from 'lit';
import FormElement from '../../form-element';

/**
 * A small, styled form control built on FDL's generic FormElement.
 *
 * FormElement supplies the label, creates the native input from the FieldType,
 * and keeps it synchronized with the Record. This subclass only adds the
 * design-system-specific presentation for text-like inputs.
 */
export class FdlInput extends FormElement {
    static get styles() {
        return css`
            ${FormElement.styles}

            :host {
                --field-label-width: 9rem;
                --field-control-width: 18rem;
                margin: 0.5rem 0;
            }

            input,
            select {
                width: 100%;
                border: 1px solid #9ca3af;
                border-radius: 0.25rem;
                padding: 0.5rem 0.625rem;
                font: inherit;
            }

            input:focus-visible {
                outline: 2px solid #2563eb;
                outline-offset: 2px;
            }
        `;
    }
}

customElements.define('fdl-input', FdlInput);
