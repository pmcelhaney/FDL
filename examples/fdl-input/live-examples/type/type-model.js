import { field } from '../../../../src/index';
import { inputTypeInitialValue } from '../../input-type-example';
import Record from '../../../../src/record.js';
export function inputTypeField(type) {
    const definition = field.label(`Example: ${type}`).type(type);
    return type === 'number' || type === 'range'
        ? definition.parser(Number)
        : definition;
}
export function createModel(inputType = 'text') {
    return new Record(
        { inputValue: inputTypeField(inputType) },
        { inputValue: inputTypeInitialValue(inputType) }
    );
}
