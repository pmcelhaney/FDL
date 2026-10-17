import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export function createModel() {
    return new Record(
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
}
