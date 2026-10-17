import { field, Record } from '../src/index';
import '../src/lit/fdl-address';
import '../examples/fdl-input/fdl-record-inspector';
import type { FdlAddress } from '../src/lit/fdl-address';
import type { FdlField } from '../src/lit/fdl-field';

afterEach(() => document.body.replaceChildren());

it('preserves the nested record and value while edits update an open inspector', async () => {
    const values = { state: 'NY' };
    const record = new Record(
        {
            address: field.semanticType('address').record({ state: field.required() }),
            other: field,
        },
        { address: values, other: '' }
    );
    const address = document.createElement('fdl-address') as FdlAddress;
    address.record = record;
    address.field = 'address';
    const inspector = document.createElement('fdl-record-inspector');
    inspector.record = record;
    document.body.append(address, inspector);
    await address.updateComplete;
    await inspector.updateComplete;
    const state = address.shadowRoot!.querySelector<FdlField>('fdl-field')!;
    await state.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 0));
    await state.updateComplete;
    const childRecord = state.record;
    const input = state.shadowRoot!.querySelector('input')!;
    const root = inspector.shadowRoot!;
    root.querySelector<HTMLButtonElement>('.nested-inspect')!.click();
    await inspector.updateComplete;

    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await inspector.updateComplete;
    expect(address.record).toBe(record);
    expect(record.getField('address')).toBe(values);
    expect(state.record).toBe(childRecord);
    expect(childRecord!.values).toBe(values);
    expect(values.state).toBe('');
    expect(root.querySelector('[data-nested-field="state"] .stored-value')!.textContent).toContain(
        '(empty string)'
    );
    expect(root.querySelector('[data-nested-field="state"] [aria-label="Invalid"]')).not.toBeNull();
    expect(root.querySelector('.record-validity')!.getAttribute('aria-label')).toBe(
        'Invalid record'
    );

    record.setField('other', 'changed');
    await address.updateComplete;
    expect(address.shadowRoot!.querySelector<FdlField>('fdl-field')!.record).toBe(childRecord);

    input.value = 'NC';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await inspector.updateComplete;
    expect(record.getField('address')).toBe(values);
    expect(state.record).toBe(childRecord);
    expect(values.state).toBe('NC');
    expect(root.querySelector('[data-nested-field="state"] .stored-value')!.textContent).toContain(
        'NC'
    );
    expect(root.querySelector('.record-validity')!.getAttribute('aria-label')).toBe('Valid record');
});
