import FieldType from './field-type.js';

/** Resolve a finalized field type without exposing the resolver publicly. */
export function resolveRecordFieldType(record, field) {
    if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const parentFieldType = record.fieldTypes[parent];

        if (parentFieldType?.hasParts) {
            return parentFieldType.parts().find(part => part.key === child).type;
        }
        return resolveRecordFieldType(record, parent);
    }
    return record.fieldTypes[field] || new FieldType();
}
