// Field rules and state for the .label() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'label';
    record = new Record(
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
