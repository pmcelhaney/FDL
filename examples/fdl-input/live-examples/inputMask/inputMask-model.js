import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
export function createModel() {
    return new Record(
        { input: field.label('Digits and periods').inputMask(/[0-9.]/) },
        { input: '7.5' }
    );
}
