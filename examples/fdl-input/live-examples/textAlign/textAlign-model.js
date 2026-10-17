import { field } from '../../../../src/index';
import Recordset from '../../../../src/recordset.js';
export function createModel() {
    return new Recordset(
        {
            left: field.label('Left').textAlign('left'),
            center: field.label('Center').textAlign('center'),
            right: field.label('Right').textAlign('right'),
        },
        [
            { left: 'Ada', center: 'Ada', right: 'Ada' },
            { left: 'Grace', center: 'Grace', right: 'Grace' },
        ]
    );
}
