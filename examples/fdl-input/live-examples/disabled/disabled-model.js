// Field rules and state for the .disabled() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'disabled';
    record = new Record(
        {
            lockedId: field.label('System ID').disabled(),
            approvalStatus: field.label('Approval status').options([
                { text: 'Draft', value: 'draft' },
                { text: 'Approved', value: 'approved' },
            ]),
            budget: field
                .label('Budget')
                .type('number')
                .disabled(
                    record => record.getField('approvalStatus') === 'approved'
                ),
        },
        { lockedId: 'SYS-77', approvalStatus: 'draft', budget: 5000 }
    );
}
