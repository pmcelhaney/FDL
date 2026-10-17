// eslint-disable-next-line @treasury/filename-match-export
export default class Field extends EventTarget {
    constructor(record, fieldName) {
        super();
        this.record = record;
        this.fieldName = fieldName;
        this.fieldType = this.record.fieldTypeForField(fieldName);

        this.previousState = {
            rawValue: this.rawValue,
            valid: this.valid,
        };

        // Note: there's no mechanism to clean up this listener when the Field is destroyed.
        // The assumption is the Field object will only be garbage collected after the Record is garbage collected.
        this.record.addEventListener('change', () => {
            if (
                this.rawValue !== this.previousState.rawValue ||
                this.valid !== this.previousState.valid
            ) {
                this.dispatchEvent(new CustomEvent('change'));
            }
            this.previousState.rawValue = this.rawValue;
            this.previousState.valid = this.valid;
        });
    }

    get value() {
        return this.print();
    }

    set value(inputValue) {
        this.set(inputValue);
        this.previousState.rawValue = this.rawValue;
    }

    get rawValue() {
        return this.record.getField(this.fieldName);
    }

    set rawValue(value) {
        this.setRaw(value);
    }

    get focusedInputValue() {
        return this.format(this.rawValue, 'input-focus');
    }

    get blurredInputValue() {
        return this.format(this.rawValue, 'input-blur');
    }

    get valid() {
        return this.isValid();
    }

    get invalid() {
        return !this.valid;
    }

    async isValidAsync() {
        return (await this.errorsAsync()).length === 0;
    }

    isValid(value = this.rawValue) {
        return this.errors(value).length === 0;
    }

    async isValidValueAsync(inputValue) {
        return (await this.errorsAsync(this.parse(inputValue))).length === 0;
    }

    isValidValue(inputValue) {
        return this.isValid(this.parse(inputValue));
    }

    errors(value = this.rawValue) {
        return this.fieldType.validate(this.fieldName, value, null, this.record);
    }

    async errorsAsync(value = this.rawValue) {
        return this.fieldType.validateAsync(this.fieldName, value, null, this.record);
    }

    readableErrors(value = this.rawValue) {
        return this.errors(value)
            .map(error => ({
                ...error,
                label: this.fieldType.label(value, this.record, 'model'),
            }))
            .map(error => `${error.label} ${error.name}`);
    }

    parse(inputValue, context = 'model') {
        return this.fieldType.parse(inputValue, this.record, context);
    }

    format(value = this.rawValue, context = 'model') {
        return this.fieldType.format(value, this.record, context);
    }

    print(value = this.rawValue) {
        return this.fieldType.print(value, this.record);
    }

    set(inputValue) {
        if (inputValue !== this.rawValue) this.setRaw(this.parse(inputValue));
    }

    setRaw(value) {
        this.record.setField(this.fieldName, value);
        this.previousState.rawValue = this.rawValue;
    }

    options() {
        return this.record.optionsForField(this.fieldName);
    }

    refreshOptions() {
        return this.record.refreshOptions();
    }

    whenOptionsReady() {
        return this.record.whenOptionsReady();
    }

    onChange(fn) {
        this.addEventListener('change', fn);
    }

    allowInputChar(char) {
        return this.fieldType.allowInputChar(char);
    }

    field(nameOrIndex) {
        return new Field(this.record, `${this.fieldName}.${nameOrIndex}`);
    }

    maxValueCount() {
        return this.fieldType.maxValueCount();
    }

    minValueCount() {
        return this.fieldType.minValueCount();
    }
}
