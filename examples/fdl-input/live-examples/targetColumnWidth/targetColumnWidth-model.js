// Field rules and state for the .targetColumnWidth() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';

import Recordset from '../../../../src/recordset.js';
export class ExampleModel extends ExampleController {
    modifier = 'targetColumnWidth';
    widthRecordsets = {
        maxColumnWidth: new Recordset(
            {
                constrained: field
                    .label('Maximum (180px)')
                    .minColumnWidth(80)
                    .maxColumnWidth(180),
                flexible: field.label('Flexible').minColumnWidth(80),
            },
            [
                {
                    constrained: 'Stops growing at 180px',
                    flexible: 'Makes up the difference',
                },
            ]
        ),
        minColumnWidth: new Recordset(
            {
                constrained: field.label('Minimum (110px)').minColumnWidth(110),
                flexible: field.label('Flexible').minColumnWidth(80),
            },
            [
                {
                    constrained: 'Stops shrinking at 110px',
                    flexible: 'Makes up the difference',
                },
            ]
        ),
        targetColumnWidth: new Recordset(
            {
                constrained: field
                    .label('Preferred (140px)')
                    .minColumnWidth(80)
                    .targetColumnWidth(140)
                    .maxColumnWidth(220),
                flexible: field.label('Flexible').minColumnWidth(80),
            },
            [
                {
                    constrained: 'Preferred width: 140px',
                    flexible: 'Makes up the difference',
                },
            ]
        ),
    };
}
