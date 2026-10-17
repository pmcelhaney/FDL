import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
export function createModel() {
    return new Record(
        {
            expenseType: field.label('Expense type').options([
                { text: 'Travel', value: 'travel' },
                { text: 'Equipment', value: 'equipment' },
            ]),
            dynamicAmount: field
                .label(record => `Amount for ${record.getField('expenseType')}`)
                .type('number'),
        },
        { expenseType: 'travel', dynamicAmount: '' }
    );
}
