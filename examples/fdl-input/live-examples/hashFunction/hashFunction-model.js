// Field rules and state for the .hashFunction() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'hashFunction';
    hashType = field.hashFunction(employee => employee.id);
    probes = new Record(
        {
            firstId: field.label('First employee ID'),
            secondId: field.label('Second employee ID'),
        },
        { firstId: 'ada', secondId: 'ada' }
    );
}
