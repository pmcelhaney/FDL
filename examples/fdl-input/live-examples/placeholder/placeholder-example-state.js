import { record } from './placeholder-model.js';
// Tutorial state for the .placeholder() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'placeholder';
    record = record;
}
