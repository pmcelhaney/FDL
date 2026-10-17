// Field rules and state for the .multipleValues() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'multipleValues';
    record = new Record(
        {
            skills: field
                .label('Skills')
                .multipleValues()
                .options([
                    { text: 'Design', value: 'design' },
                    { text: 'Engineering', value: 'engineering' },
                    { text: 'Research', value: 'research' },
                ]),
        },
        { skills: ['design'] }
    );
}
