import { field, Record } from '@pmcelhaney/fdl';
export const record = new Record(
    {
        documentTitle: field
            .label('Document title')
            .defaultValue('Untitled document'),
    },
    { documentTitle: 'Quarterly plan' }
);
