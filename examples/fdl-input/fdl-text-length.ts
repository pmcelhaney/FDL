import { LitElement, html } from 'lit';
import { field } from '../../index';
import Record from '../../record.js';
import { exampleTheme } from './example-theme';
import './fdl-example';
import './fdl-field';
import './fdl-record-inspector';

export class FdlTextLength extends LitElement {
    private settings = new Record(
        {
            minimum: field
                .label('Minimum length')
                .parser(Number)
                .options(
                    [2, 4, 8].map(value => ({
                        text: `${value} characters`,
                        value,
                    }))
                ),
            maximum: field
                .label('Maximum length')
                .parser(Number)
                .options(
                    [12, 16, 24].map(value => ({
                        text: `${value} characters`,
                        value,
                    }))
                ),
        },
        { minimum: 4, maximum: 12 }
    );
    private codeType() {
        return field
            .label('Access code')
            .minLength(this.settings.values.minimum)
            .maxLength(this.settings.values.maximum);
    }
    private record = new Record({ code: this.codeType() }, { code: '' });
    private checked = false;
    private refresh = () => this.requestUpdate();
    private changeRules = () => {
        this.record.addField(
            'code',
            this.codeType(),
            this.record.getField('code')
        );
        this.requestUpdate();
    };
    connectedCallback() {
        super.connectedCallback();
        this.settings.addEventListener('change', this.changeRules);
        this.record.addEventListener('change', this.refresh);
    }
    disconnectedCallback() {
        this.settings.removeEventListener('change', this.changeRules);
        this.record.removeEventListener('change', this.refresh);
        super.disconnectedCallback();
    }
    render() {
        const model = `import { field, Record } from '@pmcelhaney/fdl';
const record = new Record({
    code: field.label('Access code')
        .minLength(${this.settings.values.minimum})
        .maxLength(${this.settings.values.maximum}),
}, { code: '' });`;
        const view = `import { html } from 'lit';
import './fdl-field';
html\`<fdl-field .record=\${record} field="code" .showValidationErrors=\${true}></fdl-field>\`;`;
        return html`<fdl-example
            heading="Check both length limits"
            .filenames=${['text-length-model.js', 'text-length-view.js']}
            .sources=${{ 'text-length-model.js': model, 'text-length-view.js': view }}
        >
            <p
                >Change either limit without losing your code. Typing stops at
                the maximum; assigning an overlong model value bypasses that
                input cap so you can check model validation.</p
            >
            ${['minimum', 'maximum'].map(name => html`<fdl-field .record=${this.settings} field=${name}></fdl-field>`)}
            <fdl-field
                .record=${this.record}
                field="code"
                .showValidationErrors=${this.checked}
            ></fdl-field>
            <button
                @click=${() => {
                    this.checked = true;
                    this.requestUpdate();
                }}
                >Check value</button
            >
            <button
                class="model-assignment"
                @click=${() => {
                    this.record.setField(
                        'code',
                        'X'.repeat(this.settings.values.maximum + 1)
                    );
                    this.checked = true;
                    this.requestUpdate();
                }}
                >Assign an overlong model value</button
            >
            <p class="result" role="status"
                >${this.checked ? (this.record.isValid() ? 'Valid code.' : this.record.readableRecordErrors().join('. ')) : 'Check the value to show validation errors.'}</p
            >
            <fdl-record-inspector .record=${this.record}></fdl-record-inspector>
        </fdl-example>`;
    }
    static styles = [exampleTheme];
}
customElements.define('fdl-text-length', FdlTextLength);
