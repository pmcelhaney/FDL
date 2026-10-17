import { createModel } from './inputMask-model.js';
// Tutorial state for the .inputMask() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'inputMask';
    probes = createModel();
}
