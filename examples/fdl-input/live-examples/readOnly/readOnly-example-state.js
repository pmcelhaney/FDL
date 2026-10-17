import { createModel } from './readOnly-model.js';
// Tutorial state for the .readOnly() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'readOnly';
    record = createModel();
}
