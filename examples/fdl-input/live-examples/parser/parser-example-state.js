import { record } from './parser-model.js';
// Tutorial state for the .parser() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'parser';
    record = record;
}
