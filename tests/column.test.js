import FieldTypeBuilder from '../src/field-type-builder';
import Recordset from '../src/recordset.js';

it('exposes table behavior through a stable column facade', async () => {
    const recordset = new Recordset(
        {
            amount: new FieldTypeBuilder()
                .sortable(true)
                .compareFunction((a, b) => a - b)
                .reducer(values => values.reduce((sum, value) => sum + value, 0))
                .minColumnWidth(80)
                .targetColumnWidth(120)
                .maxColumnWidth(180)
                .columnClass('amount-column')
                .cellClass(value => (value > 10 ? 'large' : [])),
        },
        [{ amount: 12 }]
    );

    const column = recordset.column('amount');
    const record = recordset.createRecord({ amount: 12 });

    expect(typeof recordset.getFieldType).toBe('undefined');
    expect(typeof record.fieldTypeForField).toBe('undefined');
    expect(typeof record.field('amount').fieldType).toBe('undefined');
    expect(recordset.column('amount')).toBe(column);
    expect(column.sortable()).toBe(true);
    expect(column.compare(1, 2)).toBeLessThan(0);
    expect(column.aggregate([1, 2, 3])).toBe(6);
    expect(column.minColumnWidth()).toBe(80);
    expect(column.targetColumnWidth()).toBe(120);
    expect(column.maxColumnWidth()).toBe(180);
    expect(column.columnClasses()).toEqual(['amount-column']);
    expect(column.cellClasses(12, record)).toEqual(['large']);
});
