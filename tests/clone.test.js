import clone from '../helpers/clone.js';

describe('clone', () => {
    it('deeply clones objects without sharing nested data', () => {
        const source = { account: { balance: 100 }, tags: ['open'] };
        const copy = clone(source);

        copy.account.balance = 200;
        copy.tags.push('reviewed');

        expect(source).toEqual({ account: { balance: 100 }, tags: ['open'] });
    });

    it('preserves dates and class prototypes', () => {
        class Account {
            constructor(balance) {
                this.balance = balance;
            }

            available() {
                return this.balance;
            }
        }

        const opened = new Date('2021-09-24T12:00:00.000Z');
        const copy = clone({ account: new Account(100), opened });

        expect(copy.account).toBeInstanceOf(Account);
        expect(copy.account.available()).toBe(100);
        expect(copy.opened).toEqual(opened);
        expect(copy.opened).not.toBe(opened);
    });

    it('supports circular references', () => {
        const source = { name: 'FDL' };
        source.self = source;

        const copy = clone(source);

        expect(copy).not.toBe(source);
        expect(copy.self).toBe(copy);
    });
});
