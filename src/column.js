// eslint-disable-next-line @treasury/filename-match-export
export default class Column {
    constructor(recordset, fieldName) {
        this.recordset = recordset;
        this.fieldName = fieldName;
    }

    get fieldType() {
        return this.recordset.getFieldType(this.fieldName);
    }

    cellClasses(value, record) {
        return this.fieldType.cellClasses(value, record);
    }

    rowClasses(record) {
        return this.fieldType.rowClasses(record);
    }

    columnClasses() {
        return this.fieldType.columnClasses();
    }

    compare(a, b) {
        return this.fieldType.compare(a, b);
    }

    aggregate(values) {
        return this.fieldType.aggregate(values);
    }

    hasFilter() {
        return this.fieldType.hasFilter();
    }

    match(searchText, value) {
        return this.fieldType.match(searchText, value);
    }

    sortable() {
        return this.fieldType.sortable();
    }

    minColumnWidth() {
        return this.fieldType.minColumnWidth();
    }

    maxColumnWidth() {
        return this.fieldType.maxColumnWidth();
    }

    targetColumnWidth() {
        return this.fieldType.targetColumnWidth();
    }

    textAlign(value, record, context = 'table') {
        return this.fieldType.textAlign(value, record, context);
    }

    label(record) {
        if (record) {
            return this.fieldType.label(record.getField(this.fieldName), record, 'table-header');
        }

        return this.fieldType.properties.labelFunctions
            .filter(setting => typeof setting === 'string')
            .slice(-1)[0];
    }
}
