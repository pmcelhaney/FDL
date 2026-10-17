import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
export function createModel() {
    return new Record(
        {
            emptyCode: field
                .label('Reference')
                .emptyWhen(value => value === 'N/A')
                .required(),
            optionalEmptyCode: field
                .label('Optional reference')
                .emptyWhen(value => value === 'N/A'),
        },
        { emptyCode: 'N/A', optionalEmptyCode: 'N/A' }
    );
}
