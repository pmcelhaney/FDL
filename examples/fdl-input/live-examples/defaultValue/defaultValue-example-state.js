import { createModel } from './defaultValue-model.js';
// Tutorial state for the .defaultValue() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'defaultValue';
    defaultRecord = createModel();
    clearDefaultRecord = () => {
        this.defaultRecord.clear();
        this.requestUpdate();
    };
}
