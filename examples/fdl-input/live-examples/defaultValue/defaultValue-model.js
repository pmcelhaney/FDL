// Field rules and state for the .defaultValue() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'defaultValue';
    defaultRecord = new Record(
        {
            documentTitle: field
                .label('Document title')
                .defaultValue('Untitled document'),
        },
        { documentTitle: 'Quarterly plan' }
    );
    clearDefaultRecord = () => {
        this.defaultRecord.clear();
        this.requestUpdate();
    };
}
