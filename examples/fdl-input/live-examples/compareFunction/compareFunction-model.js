// Field rules and state for the .compareFunction() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import { compareShirtSizes, shirtOrders } from '../../shirt-size-example';

import Recordset from '../../../../src/recordset.js';
export class ExampleModel extends ExampleController {
    modifier = 'compareFunction';
    compareRecordset = new Recordset(
        {
            firstName: field
                .label('First name')
                .compareFunction((left, right) =>
                    Math.sign(left.localeCompare(right))
                ),
            lastName: field
                .label('Last name')
                .compareFunction((left, right) =>
                    Math.sign(left.localeCompare(right))
                ),
            shirtSize: field
                .label('T-shirt size')
                .compareFunction(compareShirtSizes),
        },
        shirtOrders.map(order => ({ ...order }))
    );
}
