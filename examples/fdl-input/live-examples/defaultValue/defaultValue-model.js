import { field, Record } from '@pmcelhaney/fdl';
export function createModel() {
    return new Record(
        {
            documentTitle: field
                .label('Document title')
                .defaultValue('Untitled document'),
        },
        { documentTitle: 'Quarterly plan' }
    );
}
