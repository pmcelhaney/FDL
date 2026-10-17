import { createModel } from './semanticType-model.js';
// Tutorial state for the .semanticType() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'semanticType';
    record = createModel();
}
