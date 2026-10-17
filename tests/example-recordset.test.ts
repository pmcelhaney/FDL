import FieldTypeBuilder from '../src/field-type-builder';
import ExampleRecordset from '../src/example-recordset';

it('creates example rows through an explicit application factory', async () => {
    const rows = new ExampleRecordset(
        {
            name: new FieldTypeBuilder<string>(),
            info: new FieldTypeBuilder<string>(),
        },
        3,
        index => ({ name: `Person ${index + 1}`, info: 'administrator' })
    );
    await rows.requestImmediateUpdate();
    expect(rows.allRecords.map(record => record.values)).toEqual([
        { name: 'Person 1', info: 'administrator' },
        { name: 'Person 2', info: 'administrator' },
        { name: 'Person 3', info: 'administrator' },
    ]);
});

it('does not call the row factory for an empty example recordset', async () => {
    const createRow = jest.fn(() => ({ name: 'Unused' }));
    const rows = new ExampleRecordset({ name: new FieldTypeBuilder<string>() }, 0, createRow);
    await rows.requestImmediateUpdate();
    expect(createRow).not.toHaveBeenCalled();
    expect(rows.allRecords).toEqual([]);
});
