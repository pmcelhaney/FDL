import { createModel } from './disabled-model.js';
// Tutorial state for the .disabled() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'disabled';
    record = createModel();
}
