import { record } from './formatter-model.js';
// Tutorial state for the .formatter() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    money = record;
    checked = false;
    requiredRule = true;
}
