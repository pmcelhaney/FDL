import { createModel } from './formatter-model.js';
// Tutorial state for the .formatter() example.
import { ExampleController } from '../../example-controller';

import { inputText } from '../../value-pipeline';
export class ExampleModel extends ExampleController {
    money = createModel();
    checked = false;
    requiredRule = true;
    amountInput;
    captureAmountInput = {
        capture: true,
        handleEvent: event => {
            this.amountInput = inputText(event);
            this.requestUpdate();
        },
    };
}
