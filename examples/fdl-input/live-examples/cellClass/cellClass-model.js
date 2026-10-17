import { field } from '../../../../src/index';
import {
    weeklyExpenses,
    expenseHighlightThreshold,
} from '../../weekly-expenses';

import Recordset from '../../../../src/recordset.js';
const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export function createModel(getThreshold = () => expenseHighlightThreshold) {
    return new Recordset(
        {
            day: field.label('Day').sortable(false),
            amount: field
                .label('Expenses')
                .textAlign('right')
                .formatter(value => currency.format(Number(value)))
                .cellClass('amount-cell')
                .cellClass(value =>
                    value > getThreshold() ? ['high-value', 'over-limit'] : []
                ),
        },
        weeklyExpenses.map(expense => ({ ...expense }))
    );
}
