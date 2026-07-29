import FieldType from '../field-type.js';
import Recordset from '../recordset.js';
import '../examples/fdl-input/fdl-table';

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
            <fdl-column field="firstName" sortable="true"></fdl-column>
            <fdl-column field="lastName" sortable="true"></fdl-column>
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

    it('does not sort columns without the sortable attribute', async () => {
        const recordset = new Recordset(
            { name: new FieldType() },
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
