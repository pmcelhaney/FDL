import { record } from './label-model.js';
// Tutorial state for the .label() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'label';
    record = record;
}
