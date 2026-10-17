// Field rules and state for the .rowCount() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'rowCount';
    record = new Record(
        { comments: field.label('Comments').rowCount(4) },
        { comments: '' }
    );
    probes = new Record(
        {
            textareaRows: field
                .label('Row count')
                .parser(Number)
                .options(
                    [1, 4, 10].map(value => ({ text: String(value), value }))
                ),
        },
        { textareaRows: 4 }
    );
    onProbeChange = () => {
        {
            const rows = this.probes.getField('textareaRows');
            this.record.addField(
                'comments',
                field.label('Comments').rowCount(rows),
                this.record.getField('comments')
            );
            this.dispatchEvent(
                new CustomEvent('example-settings-change', {
                    detail: { rows },
                    bubbles: true,
                    composed: true,
                })
            );
        }
        this.requestUpdate();
    };
}
