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
    it('renders every public field type modifier once in alphabetical order', async () => {
        const element = document.createElement('fdl-input-demo') as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        document.body.append(element);

        await element.updateComplete;

        const catalog = element.shadowRoot?.querySelector('fdl-modifier-catalog') as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        expect(catalog).toBeTruthy();
        await catalog.updateComplete;

        const builder = new FieldType().with as unknown as { [name: string]: unknown };
        const expectedModifiers = Object.getOwnPropertyNames(Object.getPrototypeOf(builder))
            .filter(name => name !== 'constructor' && name !== 'copy')
            .filter(name => typeof builder[name] === 'function')
            .sort((left, right) => left.localeCompare(right));
        const cards = [...(catalog.shadowRoot?.querySelectorAll<HTMLElement>('[data-modifier]') ?? [])];
        const renderedModifiers = cards.map(card => card.dataset.modifier as string);

        expect(renderedModifiers).toEqual(expectedModifiers);
        expect(new Set(renderedModifiers).size).toBe(renderedModifiers.length);
        expect(renderedModifiers).toEqual(
            [...renderedModifiers].sort((left, right) => left.localeCompare(right))
        );

        cards.forEach(card => {
            expect(card.dataset.status).toMatch(/^(live|placeholder)$/);
            expect(card.textContent?.trim().length).toBeGreaterThan(
                (card.dataset.modifier?.length ?? 0) + 20
            );
            if (card.dataset.status === 'live') {
                expect(card.querySelector('.demo')).not.toBeNull();
                expect(card.querySelector('details')).not.toBeNull();
            } else {
                expect(card.querySelector('.placeholder-body')?.textContent).toContain('Intent:');
                expect(card.querySelector('.placeholder-body')?.textContent).toContain(
                    'Why there is no live example:'
                );
            }
        });

        const asyncValidator = catalog.shadowRoot?.querySelector<HTMLElement>(
            '[data-modifier="asyncValidator"]'
        );
        expect(asyncValidator?.dataset.status).toBe('placeholder');
        expect(asyncValidator?.textContent).toMatch(/async|asynchronous/i);
        expect(asyncValidator?.textContent).toMatch(/validat/i);
        expect(asyncValidator?.textContent).toMatch(/not|doesn.t|isn.t|without|current/i);

        [
            'accept',
            'additionalProperties',
            'autofocus',
            'field',
            'formatOnChange',
            'hideLabel',
            'iconMessage',
            'list',
            'max',
            'onValueChange',
            'pattern',
            'readOnlyExceptionWhen',
            'step',
            'tag',
            'usesCustomPrint',
        ].forEach(modifier => {
            const card = catalog.shadowRoot?.querySelector<HTMLElement>(
                `[data-modifier="${modifier}"]`
            );
            expect(card?.dataset.status).toBe('placeholder');
        });

        [
            'cellClass',
            'compareFunction',
            'conditionalCellClass',
            'formatter',
            'rowClasses',
            'template',
            'textAlign',
        ].forEach(modifier => {
            expect(
                catalog.shadowRoot?.querySelector(
                    `[data-modifier="${modifier}"] fdl-table`
                )
            ).not.toBeNull();
        });

        expect(
            catalog.shadowRoot?.querySelector('[data-modifier="label"] fdl-table')
        ).toBeNull();

        element.remove();
    });

    it('keeps representative catalog examples interactive', async () => {
        const element = document.createElement('fdl-input-demo') as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        document.body.append(element);
        await element.updateComplete;

        const catalog = element.shadowRoot?.querySelector('fdl-modifier-catalog') as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        await catalog.updateComplete;

        const defaultCard = catalog.shadowRoot?.querySelector<HTMLElement>(
            '[data-modifier="defaultValue"]'
        );
        (defaultCard?.querySelector('button') as HTMLButtonElement).click();
        await catalog.updateComplete;
        expect(defaultCard?.textContent).toContain('Current record value: Pending assignment');

        const visibleCard = catalog.shadowRoot?.querySelector<HTMLElement>(
            '[data-modifier="visibleWhen"]'
        );
        const fulfillment = visibleCard?.querySelector(
            'fdl-select[field="fulfillment"]'
        ) as HTMLElement & { updateComplete: Promise<boolean> };
        await fulfillment.updateComplete;
        const select = fulfillment.shadowRoot?.querySelector('select') as HTMLSelectElement;
        select.value = 'pickup';
        select.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await new Promise(resolve => setTimeout(resolve, 0));
        await catalog.updateComplete;
        expect(visibleCard?.querySelector('fdl-input[field="address"]')?.shadowRoot?.querySelector('input')).toBeNull();

        element.remove();
    });

});
