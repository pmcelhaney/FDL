import { field } from '../src/index';
import Record from '../src/record.js';
import '../examples/fdl-input/fdl-record-inspector';

afterEach(() => document.body.replaceChildren());

async function inspect(record?: Record<any>, fields?: string[]) {
    const inspector = document.createElement('fdl-record-inspector');
    inspector.record = record;
    inspector.fields = fields;
    document.body.append(inspector);
    await inspector.updateComplete;
    return inspector;
}

it('inspects declared fields, including unset values, and preserves falsy stored values', async () => {
    const record = new Record(
        {
            count: field.label('Count'),
            enabled: field,
            missing: field,
            empty: field,
            data: field,
            nil: field,
            nonfinite: field,
        },
        { count: 0, enabled: false, empty: '', data: { answer: 42 }, nil: null, nonfinite: NaN }
    );
    const inspector = await inspect(record);
    const root = inspector.shadowRoot!;
    expect(root.querySelectorAll('tbody tr')).toHaveLength(7);
    expect([...root.querySelectorAll('thead th')].map(cell => cell.textContent)).toEqual([
        '',
        'Field',
        'Label',
        'Stored value',
    ]);
    const countRow = root.querySelector('[data-field="count"]')!;
    expect(countRow.firstElementChild!.classList.contains('status-column')).toBe(true);
    expect(countRow.querySelector('.field-name')!.textContent).toBe('count');
    expect(countRow.querySelector('.field-label')!.textContent).toBe('Count');
    expect([...root.querySelectorAll('tbody .stored-value')].map(cell => cell.textContent)).toEqual(
        ['0', 'false', '(undefined)', '(empty string)', '{"answer":42}', 'null', 'NaN']
    );
    inspector.fields = ['enabled', 'count'];
    await inspector.updateComplete;
    expect([...root.querySelectorAll('tbody th')].map(cell => cell.textContent)).toEqual([
        'enabled',
        'count',
    ]);
});

it('reflects dependent field state and record validity without a parent rerender', async () => {
    const record = new Record(
        {
            name: field
                .label('Name')
                .required()
                .visible(() => false)
                .disabled()
                .readOnly(),
        },
        { name: '' }
    );
    const inspector = await inspect(record);
    const root = inspector.shadowRoot!;
    expect(
        [...root.querySelectorAll('tbody [role="img"]')].map(icon =>
            icon.getAttribute('aria-label')
        )
    ).toEqual(['Hidden', 'Disabled', 'Read-only', 'Required', 'Invalid']);
    expect(
        root.querySelector('tbody tr')!.firstElementChild!.querySelectorAll('[role="img"]')
    ).toHaveLength(5);
    expect(root.querySelector('.validation')!.textContent).toContain('Invalid');
    record.setField('name', 'Ada');
    await inspector.updateComplete;
    expect(root.querySelector('tbody .stored-value')!.textContent).toBe('Ada');
    expect(root.querySelector('.validation')!.textContent).toContain('Valid');
});

it('collapses to an accessible icon and reopens with the latest record values', async () => {
    const record = new Record({ name: field }, { name: 'Ada' });
    const inspector = await inspect(record);
    const root = inspector.shadowRoot!;
    const button = root.querySelector('button')!;
    button.click();
    await inspector.updateComplete;
    expect(inspector.hasAttribute('collapsed')).toBe(true);
    expect(root.querySelector('h3')!.textContent).toBe('Record Inspector');
    expect(root.querySelector('.inspector-heading')!.hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('section')!.getAttribute('aria-label')).toBe('Record Inspector');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-label')).toBe('Inspect record');
    expect(root.getElementById(button.getAttribute('aria-controls')!)!.hidden).toBe(true);
    record.setField('name', 'Grace');
    button.click();
    await inspector.updateComplete;
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('tbody .stored-value')!.textContent).toBe('Grace');
    expect(record.getField('name')).toBe('Grace');
});

it('moves its subscription when replaced and removes it on disconnect, then reconnects', async () => {
    const first = new Record({ name: field }, { name: 'Ada' });
    const second = new Record({ name: field }, { name: 'Grace' });
    const removeFirst = jest.spyOn(first, 'removeEventListener');
    const removeSecond = jest.spyOn(second, 'removeEventListener');
    const inspector = await inspect(first);
    inspector.record = second;
    await inspector.updateComplete;
    expect(removeFirst).toHaveBeenCalledWith('change', expect.any(Function));
    first.setField('name', 'Old record');
    second.setField('name', 'New record');
    await inspector.updateComplete;
    expect(inspector.shadowRoot!.querySelector('tbody .stored-value')!.textContent).toBe(
        'New record'
    );
    inspector.remove();
    expect(removeSecond).toHaveBeenCalledWith('change', expect.any(Function));
    second.setField('name', 'Reconnected');
    document.body.append(inspector);
    await inspector.updateComplete;
    expect(inspector.shadowRoot!.querySelector('tbody .stored-value')!.textContent).toBe(
        'Reconnected'
    );
});

it('supports an empty inspector and a record assigned later', async () => {
    const inspector = await inspect();
    expect(inspector.shadowRoot!.textContent).toContain('No record selected.');
    inspector.record = new Record({ name: field }, { name: 'Ada' });
    await inspector.updateComplete;
    expect(inspector.shadowRoot!.querySelector('tbody .stored-value')!.textContent).toBe('Ada');
});

it('validates only the displayed fields when inspecting part of a record', async () => {
    const record = new Record(
        { shown: field.required(), unrelated: field.required() },
        { shown: 'Ada', unrelated: '' }
    );
    const inspector = await inspect(record);
    inspector.fields = ['shown'];
    await inspector.updateComplete;
    expect(record.isValid()).toBe(false);
    expect(inspector.shadowRoot!.querySelector('.validation')!.textContent).toContain(
        'Displayed fields validation:'
    );
    expect(inspector.shadowRoot!.querySelector('.validation strong')!.textContent).toBe('Valid');
    record.setField('shown', '');
    await inspector.updateComplete;
    expect(inspector.shadowRoot!.querySelector('.validation strong')!.textContent).toBe('Invalid');
});

it('inspects nested records and nested recordsets', async () => {
    const record = new Record(
        {
            address: field.record({
                street: field.required(),
                city: field,
            }),
            contacts: field.recordset({
                name: field.required(),
                email: field,
            }),
        },
        {
            address: { street: '1 Main Street', city: 'New York' },
            contacts: [
                { name: 'Ada', email: 'ada@example.com' },
                { name: 'Grace', email: 'grace@example.com' },
            ],
        }
    );
    const inspector = await inspect(record);
    const root = inspector.shadowRoot!;

    const addressButton = root.querySelector<HTMLButtonElement>(
        '[data-field="address"] .nested-inspect'
    )!;
    expect(addressButton.textContent).toContain('Inspect nested record');
    addressButton.click();
    await inspector.updateComplete;

    expect(root.querySelector('h3')!.textContent).toBe('Nested record');
    expect(root.querySelector('.back-button')).toBeTruthy();
    expect(root.textContent).toContain('1 Main Street');

    root.querySelector<HTMLButtonElement>('.back-button')!.click();
    await inspector.updateComplete;
    root.querySelector<HTMLButtonElement>('[data-field="contacts"] .nested-inspect')!.click();
    await inspector.updateComplete;
    expect(root.querySelector('h3')!.textContent).toBe('Nested recordset');
    expect(root.querySelectorAll('[data-nested-row]')).toHaveLength(2);
    expect(root.textContent).toContain('Grace');
    root.querySelector<HTMLButtonElement>('[data-nested-row="1"] .nested-inspect')!.click();
    await inspector.updateComplete;
    expect(root.querySelector('h3')!.textContent).toBe('Nested row 1');
    expect(root.textContent).toContain('Ada');
});
