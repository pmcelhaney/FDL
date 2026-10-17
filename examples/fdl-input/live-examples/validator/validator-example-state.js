import { createModel } from './validator-model.js';
// Tutorial state for the .validator() example.
import { ExampleController } from '../../example-controller';
import { field } from '@pmcelhaney/fdl';

export class ExampleModel extends ExampleController {
    modifier = 'validator';
    validatedFields = new Set();
    record = createModel();
    validateField(field) {
        this.validatedFields.add(field);
        this.requestUpdate();
    }
}
