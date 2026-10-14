import { describe, it, expect } from 'vitest';
import { makeRefResolver, type ResolverData } from './resolve-refs';

const data: ResolverData = {
    people: [
        { id: 'p1', name: 'Alex' },
        { id: 'p2', name: 'Sam' },
    ],
    incomes: [
        { id: 'i1', name: 'Salary', amountMonth: 300000, currency: 'EUR', frequency: 'Month', usage: '', holder: 'p1' },
        { id: 'i2', name: 'Wage', amountMonth: 100000, currency: 'EUR', frequency: 'Month', usage: '', holder: 'p2' },
    ],
    jointExpenses: [{ id: 'j1', name: 'Rent', amount: 100000, split: null }],
};

describe('makeRefResolver', () => {
    it('leaves a literal amount as a number', () => {
        expect(makeRefResolver(data).resolveAmount(5000)).toBe(5000);
    });

    it('resolves an income ref to { ref, id, name, value }', () => {
        expect(makeRefResolver(data).resolveAmount({ ref: 'income:i1' })).toEqual({
            ref: 'income:i1',
            id: 'i1',
            name: 'Salary',
            value: 300000,
        });
    });

    it("resolves a joint-slice ref using the person's income share", () => {
        // p1 = 75% of combined income; 75% of the 100000 pool = 75000.
        expect(makeRefResolver(data).resolveAmount({ ref: 'jointExpense:p1:rounded' })).toEqual({
            ref: 'jointExpense:p1:rounded',
            id: 'p1',
            name: 'Alex · slice',
            value: 75000,
        });
    });

    it('resolves a dangling ref to NaN with an em-dash name', () => {
        const r = makeRefResolver(data).resolveAmount({ ref: 'income:gone' });
        expect(r).toMatchObject({ ref: 'income:gone', id: 'gone', name: '—' });
        expect(typeof r === 'object' && Number.isNaN(r.value)).toBe(true);
    });
});
