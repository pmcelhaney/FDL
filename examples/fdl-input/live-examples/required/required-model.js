// Field rules and state for the .required() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
export class ExampleModel extends ExampleController {
    person = new Record(
        {
            name: field.label('Legal name').required(),
            followUp: field.label('Follow-up needed?').options([
                { text: 'No', value: 'no' },
                { text: 'Yes', value: 'yes' },
            ]),
            followUpNotes: field
                .label('Follow-up notes')
                .rowCount(2)
                .required(record => record.getField('followUp') === 'yes'),
        },
        { name: '', followUp: 'no', followUpNotes: '' }
    );
    checked = false;
    requiredRule = true;
}
