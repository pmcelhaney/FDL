import FieldTypeBuilder from '../src/field-type-builder';
import Record from '../src/record.js';
import invalidFilter from '../src/filters/invalid-filter.js';

const amount = new FieldTypeBuilder().validator({
    name: 'greater than zero',
    validate(n) {
        return n > 0;
    },
});

describe('invalidFilter', () => {
    it('is false when there are no errors', () => {
        const record = new Record({ amount }, { amount: 100 });
        expect(invalidFilter()(record)).toEqual(false);
    });

    it('is true when there are some errors', () => {
        const record = new Record({ amount }, { amount: -1 });
        expect(invalidFilter()(record)).toEqual(true);
    });
});
