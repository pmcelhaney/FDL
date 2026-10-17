import { field, Record } from '../../../../src/index';
export function codeType(minimum = 4, maximum = 12) {
    return field.label('Access code').minLength(minimum).maxLength(maximum);
}
export function createModel(minimum = 4, maximum = 12) {
    return new Record({ code: codeType(minimum, maximum) }, { code: '' });
}
