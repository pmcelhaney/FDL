// Field rules and state for the .formatter() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
import { inputText } from '../../value-pipeline';
export class ExampleModel extends ExampleController {
    money = new Record(
        {
            amount: field
                .label('Amount')
                .type('number')
                .parser(value => Number(value))
                .formatter((value, _record, context) =>
                    context === 'input-focus'
                        ? String(value)
                        : new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                          }).format(Number(value))
                ),
        },
        { amount: 1250 }
    );
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
