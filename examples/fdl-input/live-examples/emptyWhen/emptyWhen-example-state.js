import { createModel } from './emptyWhen-model.js';
// Tutorial state for the .emptyWhen() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'emptyWhen';
    record = createModel();
}
