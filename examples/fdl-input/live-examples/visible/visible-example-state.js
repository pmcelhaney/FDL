import { record } from './visible-model.js';
// Tutorial state for the .visible() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    delivery = record;
    checked = false;
    requiredRule = true;
}
