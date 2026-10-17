import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
export function createHashType() {
    return field.hashFunction(employee => employee.id);
}
export function createProbes() {
    return new Record(
        {
            firstId: field.label('First employee ID'),
            secondId: field.label('Second employee ID'),
        },
        { firstId: 'ada', secondId: 'ada' }
    );
}
