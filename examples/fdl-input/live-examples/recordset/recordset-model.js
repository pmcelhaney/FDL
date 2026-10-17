import { field, Record } from '@pmcelhaney/fdl';

const record = new Record(
    {
        value: field.label('Adapter value').recordset({
            item: field.label('Item'),
            quantity: field.type('number'),
        }),
    },
    {
        value: null,
    }
);

export { record };
