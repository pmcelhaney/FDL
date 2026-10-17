import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
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
