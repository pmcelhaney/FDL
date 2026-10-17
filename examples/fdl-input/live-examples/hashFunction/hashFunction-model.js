import { field, Record } from '@pmcelhaney/fdl';
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
