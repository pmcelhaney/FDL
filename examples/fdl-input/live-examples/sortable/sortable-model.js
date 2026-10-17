import { field } from '../../../../src/index';
import { shirtOrders } from '../../shirt-size-example';
import Recordset from '../../../../src/recordset.js';
export function createModel() {
    return new Recordset(
        {
            firstName: field
                .label('First name')
                .compareFunction((left, right) => left.localeCompare(right)),
            lastName: field
                .label('Last name')
                .compareFunction((left, right) => left.localeCompare(right)),
            shirtSize: field.label('T-shirt size').sortable(false),
        },
        shirtOrders.map(order => ({ ...order }))
    );
}
