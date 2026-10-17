import { recordset } from './compareFunction-model.js';
// Tutorial state for the .compareFunction() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'compareFunction';
    compareRecordset = recordset;
}
