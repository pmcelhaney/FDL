// Field rules and state for the .minLength() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'minLength';
    validatedFields = new Set();
    minimum = 4;
    record = new Record(
        { longCode: field.label('Access code').minLength(4) },
        { longCode: '' }
    );
    validateField(field) {
        this.validatedFields.add(field);
        this.requestUpdate();
    }
}
