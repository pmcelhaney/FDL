import { recordset } from './template-model.js';
// Tutorial state for the .template() example.
import { ExampleController } from '../../example-controller';

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export class ExampleModel extends ExampleController {
    modifier = 'template';
    templateRecordset = recordset;
}
