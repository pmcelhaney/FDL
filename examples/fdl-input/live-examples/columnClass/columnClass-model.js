// Field rules and state for the .columnClass() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';

import Recordset from '../../../../src/recordset.js';
export class ExampleModel extends ExampleController {
    modifier = 'columnClass';
    columnClassRecordset = new Recordset(
        {
            day: field.label('Day'),
            amount: field
                .label('Expenses')
                .textAlign('right')
                .columnClass('expense-column')
                .columnClass(['numeric-column'])
                .cellClass(value => (Number(value) > 100 ? 'high-value' : [])),
        },
        [
            { day: 'Monday', amount: 85.5 },
            { day: 'Tuesday', amount: 142.75 },
        ]
    );
}
