import FieldType from '../field-type.js';
import Recordset from '../recordset.js';
import { resizeColumnWidths } from '../examples/fdl-input/fdl-table';

type TestTable = HTMLElement & {
    recordset: Recordset<any>;
    updateComplete: Promise<boolean>;
};

const rows = (table: TestTable) =>
    [...(table.shadowRoot?.querySelectorAll('tbody tr') ?? [])].map(row =>
        [...row.querySelectorAll('td')].map(cell => cell.textContent?.trim())
    );

const settle = async (table: TestTable) => {
    await Promise.resolve();
    await Promise.resolve();
    await table.updateComplete;
};

describe('<fdl-table>', () => {
    it('resizes the left column and distributes the difference to columns on its right', () => {
        expect(
            resizeColumnWidths(
                [150, 100, 100],
                [{ min: 50 }, { min: 80 }, { min: 50 }],
                0,
                40
            )
        ).toEqual([190, 80, 80]);
    });

    it('stops a resize at the configured column limits', () => {
        expect(
            resizeColumnWidths(
                [150, 100],
                [{ min: 100, max: 160 }, { min: 90, max: 110 }],
                0,
                30
            )
        ).toEqual([160, 90]);
        expect(
            resizeColumnWidths(
                [150, 100],
                [{ min: 100, max: 160 }, { min: 90, max: 110 }],
                0,
                -30
            )
        ).toEqual([140, 110]);
    });

    it('continues tracking a drag after rendering replaces the resize handle', async () => {
        const recordset = new Recordset(
            {
                left: new FieldType().with.minColumnWidth(100),
                right: new FieldType().with.minColumnWidth(80),
            },
            [{ left: 'Left', right: 'Right' }]
        );
        const table = document.createElement('fdl-table') as TestTable;
        table.recordset = recordset;
        table.innerHTML = `
            <fdl-column field="left"></fdl-column>
            <fdl-column field="right"></fdl-column>
        `;
        document.body.append(table);
        await settle(table);

        const columns = table.shadowRoot?.querySelectorAll<HTMLTableColElement>('col');
        expect(columns).toHaveLength(2);
        columns![0].getBoundingClientRect = () => ({ width: 150 } as DOMRect);
        columns![1].getBoundingClientRect = () => ({ width: 100 } as DOMRect);
        const handle = table.shadowRoot?.querySelector<HTMLElement>('.resize-handle');

        handle?.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 100 }));
        window.dispatchEvent(new MouseEvent('pointermove', { clientX: 120 }));
        await table.updateComplete;

        expect(table.shadowRoot?.querySelectorAll('col')[0].getAttribute('style')).toContain(
            'width:170px'
        );
        expect(table.shadowRoot?.querySelectorAll('col')[1].getAttribute('style')).toContain(
            'width:80px'
        );

        window.dispatchEvent(new MouseEvent('pointerup'));
        table.remove();
    });

    it('supports mouse dragging when pointer events are unavailable', async () => {
        const recordset = new Recordset(
            {
                left: new FieldType().with.minColumnWidth(100),
                right: new FieldType().with.minColumnWidth(80),
            },
            [{ left: 'Left', right: 'Right' }]
        );
        const table = document.createElement('fdl-table') as TestTable;
        table.recordset = recordset;
        table.innerHTML = `
            <fdl-column field="left"></fdl-column>
            <fdl-column field="right"></fdl-column>
        `;
        document.body.append(table);
        await settle(table);

        const columns = table.shadowRoot?.querySelectorAll<HTMLTableColElement>('col');
        columns![0].getBoundingClientRect = () => ({ width: 150 } as DOMRect);
        columns![1].getBoundingClientRect = () => ({ width: 100 } as DOMRect);
        const handle = table.shadowRoot?.querySelector<HTMLElement>('.resize-handle');

        handle?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100 }));
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120 }));
        await table.updateComplete;

        expect(table.shadowRoot?.querySelectorAll('col')[0].getAttribute('style')).toContain(
            'width:170px'
        );
        expect(table.shadowRoot?.querySelectorAll('col')[1].getAttribute('style')).toContain(
            'width:80px'
        );

        window.dispatchEvent(new MouseEvent('mouseup'));
        table.remove();
    });

    it('renders recordset fields through declarative columns', async () => {
        const recordset = new Recordset(
            {
                firstName: new FieldType().with.label('First name'),
                lastName: new FieldType().with.label('Last name'),
            },
            [
                { firstName: 'Ada', lastName: 'Lovelace' },
                { firstName: 'Grace', lastName: 'Hopper' },
            ]
        );
        const table = document.createElement('fdl-table') as TestTable;
        table.recordset = recordset;
        table.innerHTML = `
            <fdl-column field="firstName"></fdl-column>
            <fdl-column field="lastName"></fdl-column>
        `;
        document.body.append(table);

        await table.updateComplete;
        await settle(table);

        expect(
            [...(table.shadowRoot?.querySelectorAll('th') ?? [])].map(header =>
                header.textContent?.trim()
            )
        ).toEqual(['First name', 'Last name']);
        expect(rows(table)).toEqual([
            ['Ada', 'Lovelace'],
            ['Grace', 'Hopper'],
        ]);

        table.remove();
    });

    it('promotes the newest sort while retaining earlier sorts as tie-breakers', async () => {
        const compare = (left: string, right: string) =>
            left.localeCompare(right) as -1 | 0 | 1;
        const recordset = new Recordset(
            {
                firstName: new FieldType().with.compareFunction(compare),
                lastName: new FieldType().with.compareFunction(compare),
            },
            [
                { firstName: 'Ada', lastName: 'Zulu' },
                { firstName: 'Grace', lastName: 'Alpha' },
                { firstName: 'Ada', lastName: 'Mike' },
                { firstName: 'Grace', lastName: 'Beta' },
            ]
        );
        const table = document.createElement('fdl-table') as TestTable;
        table.recordset = recordset;
        table.innerHTML = `
            <fdl-column field="firstName"></fdl-column>
            <fdl-column field="lastName"></fdl-column>
        `;
        document.body.append(table);

        await table.updateComplete;
        await settle(table);

        const headers = table.shadowRoot?.querySelectorAll<HTMLButtonElement>('th button');
        headers?.[1].click();
        await settle(table);
        headers?.[0].click();
        await settle(table);

        expect(recordset.sortColumns).toEqual([
            { field: 'firstName', sort: 'ascending' },
            { field: 'lastName', sort: 'ascending' },
        ]);
        expect(rows(table)).toEqual([
            ['Ada', 'Mike'],
            ['Ada', 'Zulu'],
            ['Grace', 'Alpha'],
            ['Grace', 'Beta'],
        ]);
        expect(headers?.[0].title).toContain('sort priority 1');
        expect(headers?.[1].title).toContain('sort priority 2');

        headers?.[0].click();
        await settle(table);
        expect(rows(table)).toEqual([
            ['Grace', 'Alpha'],
            ['Grace', 'Beta'],
            ['Ada', 'Mike'],
            ['Ada', 'Zulu'],
        ]);

        table.remove();
    });

    it('does not sort fields configured with sortable(false)', async () => {
        const recordset = new Recordset(
            { name: new FieldType().with.sortable(false) },
            [{ name: 'Zulu' }, { name: 'Alpha' }]
        );
        const table = document.createElement('fdl-table') as TestTable;
        table.recordset = recordset;
        table.innerHTML = '<fdl-column field="name"></fdl-column>';
        document.body.append(table);

        await table.updateComplete;
        await settle(table);

        expect(table.shadowRoot?.querySelector('th button')).toBeNull();
        expect(recordset.sortColumns).toEqual([]);

        table.remove();
    });
});
