import { record } from './options-model.js';
// Tutorial state for the .options() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'options';
    record = record;
}
