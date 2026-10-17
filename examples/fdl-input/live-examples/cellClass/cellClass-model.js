// Field rules and state for the .cellClass() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import {
    weeklyExpenses,
    expenseHighlightThreshold,
} from '../../weekly-expenses';
import Record from '../../../../src/record.js';
import Recordset from '../../../../src/recordset.js';
const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export class ExampleModel extends ExampleController {
    modifier = 'cellClass';
    cellClassRecordset = new Recordset(
        {
            day: field.label('Day').sortable(false),
            amount: field
                .label('Expenses')
                .textAlign('right')
                .formatter(value => currency.format(Number(value)))
                .cellClass('amount-cell')
                .cellClass(value =>
                    value > this.probes.getField('classThreshold')
                        ? ['high-value', 'over-limit']
                        : []
                ),
        },
        weeklyExpenses.map(expense => ({ ...expense }))
    );
    probes = new Record(
        {
            classThreshold: field
                .label('Daily Expense Limit')
                .type('number')
                .parser(Number),
        },
        { classThreshold: expenseHighlightThreshold }
    );
    onProbeChange = () => {
        {
            const threshold = this.probes.getField('classThreshold');
            void this.cellClassRecordset.requestImmediateUpdate();
            this.dispatchEvent(
                new CustomEvent('example-settings-change', {
                    detail: { threshold },
                    bubbles: true,
                    composed: true,
                })
            );
        }
        this.requestUpdate();
    };
}
