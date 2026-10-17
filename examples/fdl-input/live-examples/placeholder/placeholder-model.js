// Field rules and state for the .placeholder() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'placeholder';
    record = new Record(
        {
            projectName: field
                .label('Project name')
                .placeholder('For example, Apollo migration'),
        },
        { projectName: '' }
    );
}
