import { css, html, nothing, type PropertyValues } from 'lit';
import './fdl-field';
import { property } from 'lit/decorators.js';
import { Record } from '../index';
import { RecordElement } from './record-context';
import './fdl-record';

/**
 * A focused composite adapter for nested address records.
 * The parent FDL field owns the value; this element owns the accessible group
 * and delegates each child to the ordinary fdl-field adapter.
 */
export class FdlAddress extends RecordElement {
    static styles = css`
        :host {
            display: block;
            margin: 0 0 16px;
        }

        fieldset {
            display: grid;
            grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
            gap: 0 16px;
            margin: 0;
            padding: 16px;
            border: 1px solid #94a3b8;
            border-radius: 8px;
            background: #f8fafc;
        }

        legend {
            padding: 0 8px;
            font-weight: 700;
            color: #0f172a;
        }

        .street,
        .city {
            grid-column: 1 / -1;
        }

        @media (max-width: 620px) {
            fieldset {
                grid-template-columns: 1fr;
            }

            .street,
            .city {
                grid-column: auto;
            }
        }
    `;

    @property({ type: String })
    public field = '';

    @property({ type: Boolean, attribute: 'show-validation-errors' })
    public showValidationErrors = false;

    private childRecord?: Record<any>;
    private parentChangeListener?: EventListener;
    private syncingParent = false;

    connectedCallback() {
        super.connectedCallback();
        this.parentChangeListener = () => this.syncChildRecord();
        this.record?.addEventListener('change', this.parentChangeListener);
    }

    disconnectedCallback() {
        if (this.parentChangeListener) {
            this.record?.removeEventListener('change', this.parentChangeListener);
        }
        super.disconnectedCallback();
    }

    protected willUpdate(changedProperties: PropertyValues<this>) {
        if (changedProperties.has('record')) {
            if (this.parentChangeListener) {
                changedProperties
                    .get('record')
                    ?.removeEventListener('change', this.parentChangeListener);
            }
            this.record?.addEventListener('change', this.parentChangeListener!);
        }
        if (changedProperties.has('record') || changedProperties.has('field')) {
            this.syncChildRecord();
        }
    }

    private syncChildRecord() {
        if (this.syncingParent || !this.record || !this.field) return;
        this.requestUpdate();
        const parentField = this.record.field(this.field);
        const definitions = parentField.recordDefinition;
        if (!definitions) {
            this.childRecord = undefined;
            return;
        }
        const values = parentField.rawValue ?? {};
        if (this.childRecord?.values === values) return;
        this.childRecord = new Record(definitions, values);
        this.requestUpdate();
        this.childRecord.addEventListener('change', () => {
            if (!this.record || !this.childRecord) return;
            this.syncingParent = true;
            this.record.setField(this.field, this.childRecord.values);
            this.syncingParent = false;
        });
    }

    render() {
        if (!this.record || !this.childRecord) return nothing;
        const parentField = this.record.field(this.field);
        if (!parentField.visible) return nothing;
        const childFields = Object.keys(this.childRecord.fieldTypes);
        return html`<fdl-record .record=${this.childRecord}
            ><fieldset>
                <legend>${parentField.label}</legend>
                ${childFields.map(
                    child =>
                        html`<fdl-field
                            class=${child}
                            field=${child}
                            .showValidationErrors=${this.showValidationErrors}
                        ></fdl-field>`
                )}
            </fieldset></fdl-record
        >`;
    }
}

customElements.define('fdl-address', FdlAddress);
