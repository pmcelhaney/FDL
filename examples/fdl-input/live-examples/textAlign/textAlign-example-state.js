import { createModel } from './textAlign-model.js';
// Tutorial state for the .textAlign() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'textAlign';
    alignRecordset = createModel();
}
