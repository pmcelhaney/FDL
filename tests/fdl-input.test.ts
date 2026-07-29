import FieldType from '../field-type.js';
import Record from '../record.js';
import '../examples/fdl-input/fdl-input';
import '../examples/fdl-input/fdl-select';
import '../examples/fdl-input/fdl-input-demo';

describe('<fdl-input>', () => {
    it('creates and initializes the native input from the record field type', async () => {
        const record = new Record(
            {
                name: new FieldType().with
                    .label('Full name')
                    .and.placeholder('Ada Lovelace')
                    .and.required(),
            },
            { name: 'Ada' }
        );

        const element = document.createElement('fdl-input') as HTMLElement & {
            field: string;
            record: Record;
            updateComplete: Promise<boolean>;
        };
        element.field = 'name';
        element.record = record;
        document.body.append(element);

        await element.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 0));
        await element.updateComplete;

        const input = element.shadowRoot?.querySelector('input');
        expect(input?.value).toBe('Ada');
        expect(input?.placeholder).toBe('Ada Lovelace');
        expect(input?.required).toBe(true);
        expect(element.shadowRoot?.querySelector('label')?.textContent).toContain('Full name');

        element.remove();
    });

    it('creates a textarea without assigning an unsupported input type', async () => {
        const record = new Record(
            { notes: new FieldType().with.tag('textarea').and.rowCount(3) },
            { notes: '' }
        );
        const element = document.createElement('fdl-input') as HTMLElement & {
            field: string;
            record: Record;
            updateComplete: Promise<boolean>;
        };
        element.field = 'notes';
        element.record = record;
        document.body.append(element);

        await element.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(element.shadowRoot?.querySelector('textarea')?.rows).toBe(3);
        element.remove();
    });

    it('does not render a field when visibleWhen() returns false', async () => {
        const record = new Record(
            { address: new FieldType().with.label('Address').and.visibleWhen(() => false) },
            { address: '' }
        );
        const element = document.createElement('fdl-input') as HTMLElement & {
            field: string;
            record: Record;
            updateComplete: Promise<boolean>;
        };
        element.field = 'address';
        element.record = record;
        document.body.append(element);

        await element.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(element.shadowRoot?.querySelector('label')).toBeNull();
        expect(element.shadowRoot?.querySelector('input')).toBeNull();
        element.remove();
    });
});

describe('<fdl-input-demo>', () => {
    it('renders FDL validation errors after submission', async () => {
        const element = document.createElement('fdl-input-demo') as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        document.body.append(element);

        await element.updateComplete;
        expect(element.shadowRoot?.querySelectorAll('.code-panel').length).toBe(3);
        expect(element.shadowRoot?.textContent).toContain(".and.visibleWhen(record => record.getField('fulfillment') === 'ship')");
        expect(element.shadowRoot?.textContent).toContain('readOnlyExceptionWhen()');
        expect(element.shadowRoot?.textContent).not.toContain('hashFunction');
        const form = element.shadowRoot?.querySelector('form');
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await element.updateComplete;

        expect(element.shadowRoot?.querySelector('[role="alert"]')?.textContent).toContain(
            'Legal name is required'
        );
        expect(element.shadowRoot?.querySelectorAll('[role="alert"]').length).toBe(2);

        const nameField = element.shadowRoot?.querySelector('fdl-input[field="name"]') as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        await nameField.updateComplete;
        const nameInput = nameField.shadowRoot?.querySelector('input') as HTMLInputElement;
        nameInput.value = 'Ada Lovelace';
        nameInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await new Promise(resolve => setTimeout(resolve, 0));
        await element.updateComplete;

        expect(element.shadowRoot?.textContent).toContain('Work email is required');
        expect(element.shadowRoot?.querySelectorAll('[role="alert"]').length).toBe(2);

        const emailField = element.shadowRoot?.querySelector('fdl-input[field="email"]') as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        await emailField.updateComplete;
        const emailInput = emailField.shadowRoot?.querySelector('input') as HTMLInputElement;
        emailInput.value = 'ada@example.com';
        emailInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await new Promise(resolve => setTimeout(resolve, 0));
        await element.updateComplete;

        const contactMethodField = element.shadowRoot?.querySelector(
            'fdl-select[field="employmentType"]'
        ) as HTMLElement & { updateComplete: Promise<boolean> };
        await contactMethodField.updateComplete;
        const contactMethod = contactMethodField.shadowRoot?.querySelector(
            'select'
        ) as HTMLSelectElement;
        expect([...contactMethod.options].map(option => option.text)).toEqual([
            'Choose a type',
            'Full-time',
            'Contractor',
        ]);

        contactMethod.value = 'full-time';
        contactMethod.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await new Promise(resolve => setTimeout(resolve, 0));
        await element.updateComplete;
        expect(element.shadowRoot?.textContent).toContain('Ready for HR review.');

        element.remove();
    });
});
