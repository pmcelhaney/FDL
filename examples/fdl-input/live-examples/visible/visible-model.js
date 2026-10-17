import { field, Record } from '@pmcelhaney/fdl';
export function createModel() {
    return new Record(
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
}
