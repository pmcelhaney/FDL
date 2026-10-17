import { record } from './validator-model.js';
// Tutorial state for the .validator() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'validator';
    record = record;
}
