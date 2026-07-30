import { css } from 'lit';
import FormElement from '../../form-element';

/**
 * FDL's select form element. FormElement creates the native select from the
 * field type; this subclass supplies the select-specific presentation.
 */
export class FdlSelect extends FormElement {
    static get styles() {
        return css`
            ${FormElement.styles}

            :host {
                --field-label-width: 9rem;
                --field-control-width: 18rem;
                margin: 0.5rem 0;
            }

            select {
                width: 100%;
                border: 1px solid #cbd2df;
                border-radius: 0.45rem;
                background: white;
                padding: 0.5rem 0.625rem;
                font: inherit;
                min-height: 2.35rem;
            }

            select:focus-visible {
                outline: 2px solid #7657ff;
                outline-offset: 2px;
            }
        `;
    }
}

customElements.define('fdl-select', FdlSelect);
