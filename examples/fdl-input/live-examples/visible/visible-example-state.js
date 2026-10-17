import { createModel } from './visible-model.js';
// Tutorial state for the .visible() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    delivery = createModel();
    checked = false;
    requiredRule = true;
}
