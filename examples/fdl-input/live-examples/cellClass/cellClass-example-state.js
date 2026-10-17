import { createModel } from './cellClass-model.js';
// Tutorial state for the .cellClass() example.
import { ExampleController } from '../../example-controller';
import { field, Record } from '@pmcelhaney/fdl';
import {
    weeklyExpenses,
    expenseHighlightThreshold,
} from '../../weekly-expenses';

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export class ExampleModel extends ExampleController {
    modifier = 'cellClass';
    cellClassRecordset = createModel(() =>
        this.probes.getField('classThreshold')
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
