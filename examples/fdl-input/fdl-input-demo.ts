import { LitElement, css, html } from 'lit';
import FieldType from '../../field-type.js';
import Record from '../../record.js';
import './fdl-input';
import './fdl-select';

export class FdlInputDemo extends LitElement {
    private record = new Record(
        {
            name: new FieldType().with
                .label('Full name')
                .and.placeholder('Ada Lovelace')
                .and.required(),
            email: new FieldType().with
                .label('Email address')
                .and.type('email')
                .and.placeholder('ada@example.com')
                .and.requiredWhen(record => String(record.getField('name')).trim().length > 0)
                .and.validator({
                    name: 'must be a valid email address',
                    validate: modelValue => {
                        const value = String(modelValue ?? '');
                        return value === '' || /^\S+@\S+\.\S+$/.test(value);
                    },
                }),
            contactMethod: new FieldType().with
                .tag('select')
                .and.label('Preferred contact method')
                .and.options([
                    { text: 'Choose a method', value: '' },
                    { text: 'Email', value: 'email' },
                    { text: 'Phone', value: 'phone' },
                ])
                .and.required(),
        },
        { name: '', email: '', contactMethod: '' }
    );

    private hasSubmitted = false;

    private errors: { [field: string]: string[] } = {};

    private validationErrors() {
        return Object.fromEntries(
            Object.keys(this.record.fieldTypes).map(field => [
                field,
                this.record.readableFieldErrors(field),
            ])
        );
    }

    private onRecordChange = () => {
        if (this.hasSubmitted) this.errors = this.validationErrors();
        this.requestUpdate();
    };

    private validate = (event: SubmitEvent) => {
        event.preventDefault();
        this.hasSubmitted = true;
        this.errors = this.validationErrors();
        this.requestUpdate();
    };

    private renderErrors(field: string) {
        const errors = this.errors[field] ?? [];
        if (!this.hasSubmitted || errors.length === 0) return null;
        return html`<ul class="errors" role="alert">
            ${errors.map(error => html`<li>${error}</li>`)}
        </ul>`;
    }

    connectedCallback() {
        super.connectedCallback();
        this.record.addEventListener('change', this.onRecordChange);
    }

    disconnectedCallback() {
        this.record.removeEventListener('change', this.onRecordChange);
        super.disconnectedCallback();
    }

    render() {
        return html`
            <main>
                <h1><code>&lt;fdl-input&gt;</code> demo</h1>
                <p>
                    Each field is an <code>fdl-input</code> subclass of
                    <code>FormElement</code>, bound to the same FDL record.
                </p>
                <p>
                    The email address is optional until a full name is entered; then FDL's
                    <code>requiredWhen()</code> rule makes it required.
                </p>
                <p>
                    Preferred contact method uses <code>.tag('select').options(...)</code> to
                    create and populate a native dropdown.
                </p>

                <form novalidate @submit=${this.validate}>
                    <div class="field">
                        <fdl-input field="name" .record=${this.record}></fdl-input>
                        ${this.renderErrors('name')}
                    </div>
                    <div class="field">
                        <fdl-input field="email" .record=${this.record}></fdl-input>
                        ${this.renderErrors('email')}
                    </div>
                    <div class="field">
                        <fdl-select field="contactMethod" .record=${this.record}></fdl-select>
                        ${this.renderErrors('contactMethod')}
                    </div>
                    <button type="submit">Validate form</button>
                </form>

                ${this.hasSubmitted && this.record.isValid()
                    ? html`<p class="success" role="status">The record is valid.</p>`
                    : null}

                <h2>Record values</h2>
                <pre>${JSON.stringify(this.record.values, null, 2)}</pre>
            </main>
        `;
    }

    static styles = css`
        :host {
            display: block;
            color: #1f2937;
            font-family: system-ui, sans-serif;
        }

        main {
            max-width: 42rem;
            margin: 3rem auto;
            padding: 0 1.25rem;
        }

        h1 {
            margin-bottom: 0.25rem;
        }

        p {
            color: #4b5563;
        }

        form {
            margin: 2rem 0;
        }

        .field {
            margin-bottom: 0.75rem;
        }

        button {
            border: 0;
            border-radius: 0.25rem;
            background: #1d4ed8;
            color: white;
            cursor: pointer;
            font: inherit;
            padding: 0.5rem 0.75rem;
        }

        .errors {
            color: #b91c1c;
            font-size: 0.875rem;
            margin: 0.25rem 0 0 9rem;
        }

        .success {
            color: #15803d;
        }

        pre {
            overflow: auto;
            border-radius: 0.375rem;
            background: #111827;
            color: #e5e7eb;
            padding: 1rem;
        }
    `;
}

customElements.define('fdl-input-demo', FdlInputDemo);
