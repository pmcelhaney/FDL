import { createModel } from './parser-model.js';
// Tutorial state for the .parser() example.
import { ExampleController } from '../../example-controller';

import { inputText } from '../../value-pipeline';
const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export class ExampleModel extends ExampleController {
    modifier = 'parser';
    moneyInput;
    captureMoneyInput = {
        capture: true,
        handleEvent: event => {
            this.moneyInput = inputText(event);
            this.requestUpdate();
        },
    };
    record = createModel();
}
