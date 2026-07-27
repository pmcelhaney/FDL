import Recordset from './recordset.js';
import FieldType from './field-type';

type ExampleFields<T extends object> = {
    [K in keyof T]: FieldType<T[K]>;
};

export default class ExampleRecordset<
    T extends object
> extends Recordset<T> {
    constructor(fields: ExampleFields<T>, rowCount: number) {
        const data = Array.from({ length: rowCount }, (_, index) =>
            Object.fromEntries(
                Object.keys(fields).map(fieldName => {
                    const fieldType = fields[fieldName as keyof T];
                    return [fieldName, fieldType.exampleValue()(index)];
                })
            ) as T
        );
        super(fields, () => data);
    }
}
