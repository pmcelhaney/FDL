// Field rules and state for the .readOnly() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'readOnly';
    record = new Record(
        {
            fixedOwner: field.label('Owner').readOnly(),
            phase: field.label('Phase').options([
                { text: 'Draft', value: 'draft' },
                { text: 'Submitted', value: 'submitted' },
            ]),
            conditionalOwner: field
                .label('Request owner')
                .readOnly(record => record.getField('phase') === 'submitted'),
        },
        {
            fixedOwner: 'Ada Lovelace',
            phase: 'draft',
            conditionalOwner: 'Ada Lovelace',
        }
    );
}
