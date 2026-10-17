import { html, render, LitElement } from 'lit';
import { field, Record } from '../src/index';
import '../src/lit';
import { FdlRecord, FdlField, FdlAddress } from '../src/lit';
import { FdlRecordInspector } from '../examples/fdl-input/fdl-record-inspector';

async function settle() {
    for (let i = 0; i < 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 0));
    }
}

function person(name: string) {
    return new Record({ name: field.label('Name') }, { name });
}

function input(element: Element) {
    return element.shadowRoot!.querySelector('input')!;
}

let container: HTMLDivElement;
beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
});
afterEach(() => {
    container.remove();
});

it('shares one record through ordinary containers and round-trips edits', async () => {
    const record = person('Ada');
    render(
        html`<fdl-record .record=${record}
            ><section><fdl-field field="name"></fdl-field></section
            ><fdl-field field="name"></fdl-field
        ></fdl-record>`,
        container
    );
    await settle();
    const fields = [...document.querySelectorAll<FdlField>('fdl-field')];
    expect(fields.map(element => element.record)).toEqual([record, record]);
    expect(fields.map(element => input(element).value)).toEqual(['Ada', 'Ada']);
    input(fields[0]).value = 'Grace';
    input(fields[0]).dispatchEvent(new Event('input'));
    await settle();
    expect(record.getField('name')).toBe('Grace');
    expect(input(fields[1]).value).toBe('Grace');
});

it('switches records, removes the old subscription, and accepts a late record', async () => {
    render(html`<fdl-record><fdl-field field="name"></fdl-field></fdl-record>`, container);
    await settle();
    const provider = document.querySelector<FdlRecord>('fdl-record')!;
    const element = document.querySelector<FdlField>('fdl-field')!;
    expect(element.shadowRoot!.querySelector('input')).toBeNull();
    const first = person('Ada');
    provider.record = first;
    await settle();
    expect(input(element).value).toBe('Ada');
    const remove = jest.spyOn(first, 'removeEventListener');
    const second = person('Grace');
    provider.record = second;
    await settle();
    expect(input(element).value).toBe('Grace');
    expect(remove).toHaveBeenCalledWith('change', expect.any(Function));
    input(element).value = 'Katherine';
    input(element).dispatchEvent(new Event('input'));
    expect(second.getField('name')).toBe('Katherine');
    expect(first.getField('name')).toBe('Ada');
    provider.record = undefined;
    await settle();
    expect(element.shadowRoot!.querySelector('input')).toBeNull();
    provider.record = first;
    await settle();
    expect(input(element).value).toBe('Ada');
});

it('uses the nearest provider, preserves explicit overrides, and rebinds moved children', async () => {
    const outer = person('Outer');
    const inner = person('Inner');
    const explicit = person('Explicit');
    render(
        html`<fdl-record .record=${outer}
            ><fdl-record .record=${inner}
                ><fdl-field field="name"></fdl-field
                ><fdl-field field="name" .record=${explicit}></fdl-field></fdl-record
        ></fdl-record>`,
        container
    );
    await settle();
    const providers = document.querySelectorAll<FdlRecord>('fdl-record');
    const fields = document.querySelectorAll<FdlField>('fdl-field');
    expect(input(fields[0]).value).toBe('Inner');
    expect(input(fields[1]).value).toBe('Explicit');
    fields[1].record = undefined;
    await settle();
    expect(input(fields[1]).value).toBe('Inner');
    providers[0].append(fields[0]);
    await settle();
    expect(input(fields[0]).value).toBe('Outer');
    providers[1].record = person('Replacement');
    await settle();
    expect(input(fields[0]).value).toBe('Outer');
    expect(input(fields[1]).value).toBe('Replacement');
    providers[1].record = undefined;
    await settle();
    expect(fields[1].record).toBeUndefined();
});

it('provides records across shadow roots, including newly rendered children', async () => {
    class RecordTestChild extends LitElement {
        render() {
            return html`<fdl-field field="name"></fdl-field>`;
        }
    }
    customElements.define('record-test-child', RecordTestChild);
    const record = person('Ada');
    render(
        html`<fdl-record .record=${record}><record-test-child></record-test-child></fdl-record>`,
        container
    );
    await settle();
    const child = document.querySelector('record-test-child')!;
    const element = child.shadowRoot!.querySelector<FdlField>('fdl-field')!;
    expect(input(element).value).toBe('Ada');
    document.querySelector<FdlRecord>('fdl-record')!.record = person('Grace');
    await settle();
    expect(input(element).value).toBe('Grace');
});

it('updates the native control kind when the provided definition changes', async () => {
    render(
        html`<fdl-record .record=${person('Ada')}
            ><fdl-field field="name"></fdl-field
        ></fdl-record>`,
        container
    );
    await settle();
    const record = new Record(
        {
            name: field.options([
                { text: 'Grace', value: 'Grace' },
                { text: 'Ada', value: 'Ada' },
            ]),
        },
        { name: 'Grace' }
    );
    document.querySelector<FdlRecord>('fdl-record')!.record = record;
    await settle();
    const element = document.querySelector<FdlField>('fdl-field')!;
    expect(element.shadowRoot!.querySelector('input')).toBeNull();
    expect(element.shadowRoot!.querySelector('select')!.value).toBe('Grace');
});

it('provides records to address adapters and example inspectors', async () => {
    // Reference the class so its registration is retained by TypeScript.
    expect(FdlRecordInspector).toBeDefined();
    const record = new Record(
        { address: field.record({ name: field }) },
        { address: { name: 'Ada' } }
    );
    render(
        html`<fdl-record .record=${record}
            ><fdl-address field="address"></fdl-address><fdl-record-inspector></fdl-record-inspector
        ></fdl-record>`,
        container
    );
    await settle();
    const address = document.querySelector<FdlAddress>('fdl-address')!;
    expect(address.record).toBe(record);
    const child = address.shadowRoot!.querySelector<FdlField>('fdl-field')!;
    expect(input(child).value).toBe('Ada');
    expect(document.querySelector<FdlRecordInspector>('fdl-record-inspector')!.record).toBe(record);
});

it('ignores pending options from a previous provider record', async () => {
    let finish!: (options: { text: string; value: string }[]) => void;
    const pending = new Promise<{ text: string; value: string }[]>(resolve => {
        finish = resolve;
    });
    const first = new Record({ name: field.options(() => pending) }, { name: 'old' });
    const second = new Record(
        { name: field.options([{ text: 'New', value: 'new' }]) },
        { name: 'new' }
    );
    render(
        html`<fdl-record .record=${first}><fdl-field field="name"></fdl-field></fdl-record>`,
        container
    );
    await settle();
    document.querySelector<FdlRecord>('fdl-record')!.record = second;
    await settle();
    finish([{ text: 'Old', value: 'old' }]);
    await settle();
    const select = document
        .querySelector<FdlField>('fdl-field')!
        .shadowRoot!.querySelector('select')!;
    expect(select.value).toBe('new');
    expect([...select.options].map(option => option.textContent)).toEqual(['New']);
});

it('binds children added after the provider has rendered', async () => {
    const record = person('Ada');
    render(html`<fdl-record .record=${record}></fdl-record>`, container);
    await settle();
    const child = document.createElement('fdl-field') as FdlField;
    child.field = 'name';
    document.querySelector('fdl-record')!.append(child);
    await settle();
    expect(input(child).value).toBe('Ada');
});
