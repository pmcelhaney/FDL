// Field rules and state for the .parser() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

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
    record = new Record(
        {
            money: field
                .label('Money')
                .formatter(value => currency.format(Number(value)))
                .parser(value => Number(String(value).replace(/[$,]/g, ''))),
        },
        { money: 1000 }
    );
}
