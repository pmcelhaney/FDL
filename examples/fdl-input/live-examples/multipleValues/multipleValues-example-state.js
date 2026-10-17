import { record } from './multipleValues-model.js';
// Tutorial state for the .multipleValues() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'multipleValues';
    record = record;
}
