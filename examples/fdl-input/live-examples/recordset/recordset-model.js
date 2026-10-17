import { field, Record } from '../../../../src/index.js';

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
