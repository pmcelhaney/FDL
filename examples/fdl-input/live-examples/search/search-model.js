import { field, Record } from '@pmcelhaney/fdl';

const record = new Record(
    {
        value: field.label('Adapter value').search({
            title: 'Find a person',
            columns: [{ label: 'Name', field: 'name' }],
        }),
    },
    {
        value: null,
    }
);

export { record };
