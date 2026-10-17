import { field } from '../../../../src/index';
import Recordset from '../../../../src/recordset.js';
export function createModel() {
    return new Recordset(
        {
            status: field
                .label('Status')
                .rowClass('invoice-row')
                .rowClass(record =>
                    record.getField('status') === 'Disputed'
                        ? ['disputed-row', 'needs-review']
                        : []
                ),
            owner: field.label('Owner'),
        },
        [
            { status: 'Disputed', owner: 'Ada' },
            { status: 'Paid', owner: 'Grace' },
        ]
    );
}
