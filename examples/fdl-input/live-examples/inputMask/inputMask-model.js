// Field rules and state for the .inputMask() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'inputMask';
    probes = new Record(
        { input: field.label('Digits and periods').inputMask(/[0-9.]/) },
        { input: '7.5' }
    );
}
