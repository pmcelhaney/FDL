// Field rules and state for the .visible() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
export class ExampleModel extends ExampleController {
    delivery = new Record(
        {
            fulfillment: field.label('Delivery method').options([
                { text: 'Ship to address', value: 'ship' },
                { text: 'Pick up in person', value: 'pickup' },
            ]),
            address: field
                .label('Shipping address')
                .visible(record => record.getField('fulfillment') === 'ship'),
        },
        { fulfillment: 'ship', address: '42 Orchard Street' }
    );
    checked = false;
    requiredRule = true;
}
