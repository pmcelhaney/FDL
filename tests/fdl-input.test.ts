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
});

describe('<fdl-input-demo>', () => {
    it('renders FDL validation errors after submission', async () => {
        const element = document.createElement('fdl-input-demo') as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        document.body.append(element);

        await element.updateComplete;
        const form = element.shadowRoot?.querySelector('form');
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await element.updateComplete;

        expect(element.shadowRoot?.querySelector('[role="alert"]')?.textContent).toContain(
            'Full name is required'
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

        expect(element.shadowRoot?.querySelector('[role="alert"]')?.textContent).toContain(
            'Email address is required'
        );
        expect(element.shadowRoot?.querySelectorAll('[role="alert"]').length).toBe(2);

        const contactMethodField = element.shadowRoot?.querySelector(
            'fdl-select[field="contactMethod"]'
        ) as HTMLElement & { updateComplete: Promise<boolean> };
        await contactMethodField.updateComplete;
        const contactMethod = contactMethodField.shadowRoot?.querySelector(
            'select'
        ) as HTMLSelectElement;
        expect([...contactMethod.options].map(option => option.text)).toEqual([
            'Choose a method',
            'Email',
            'Phone',
        ]);

        contactMethod.value = 'phone';
        contactMethod.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await new Promise(resolve => setTimeout(resolve, 0));
        await element.updateComplete;
        expect(element.shadowRoot?.querySelector('pre')?.textContent).toContain(
            '"contactMethod": "phone"'
        );

        element.remove();
    });
});
