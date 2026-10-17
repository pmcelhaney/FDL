// Field rules and state for the .maxLength() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'maxLength';
    validatedFields = new Set();
    record = new Record(
        { shortCode: field.label('Short code').maxLength(12) },
        { shortCode: '' }
    );
    validateField(field) {
        this.validatedFields.add(field);
        this.requestUpdate();
    }
}
