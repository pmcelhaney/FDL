import { recordset } from './columnClass-model.js';
// Tutorial state for the .columnClass() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'columnClass';
    columnClassRecordset = recordset;
}
