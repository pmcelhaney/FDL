import { field, Record } from '@pmcelhaney/bizallele';
export const record = new Record(
    { input: field.label('Digits and periods').inputMask(/[0-9.]/) },
    { input: '7.5' }
);
