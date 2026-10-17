// Field rules and state for the .emptyWhen() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'emptyWhen';
    record = new Record(
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
