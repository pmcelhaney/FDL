import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
export function createReducerType() {
    return field.reducer('sum');
}
export function createProbes() {
    return new Record(
        {
            firstAmount: field
                .label('First amount')
                .type('number')
                .parser(Number),
            secondAmount: field
                .label('Second amount')
                .type('number')
                .parser(Number),
            thirdAmount: field
                .label('Third amount')
                .type('number')
                .parser(Number),
        },
        { firstAmount: 1200, secondAmount: 800, thirdAmount: 500 }
    );
}
