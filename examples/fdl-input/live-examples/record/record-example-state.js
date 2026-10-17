import { record } from './record-model.js';
// Tutorial state for the .record() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'record';
    record = record;
}
