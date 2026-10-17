import { recordset } from './rowClass-model.js';
// Tutorial state for the .rowClass() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'rowClass';
    rowClassRecordset = recordset;
}
