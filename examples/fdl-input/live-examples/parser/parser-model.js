import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export function createModel() {
    return new Record(
        {
            money: field
                .label('Money')
                .formatter(value => currency.format(Number(value)))
                .parser(value => Number(String(value).replace(/[$,]/g, ''))),
        },
        { money: 1000 }
    );
}
