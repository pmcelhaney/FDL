import { recordset } from './sortable-model.js';
// Tutorial state for the .sortable() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'sortable';
    sortableRecordset = recordset;
}
