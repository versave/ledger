import { describe, it, expect } from 'vitest';
import { isRef, resolveAmount } from './amount';

describe('amount', () => {
    it('resolves a literal (cents) to itself', () => {
        expect(resolveAmount(1000, () => NaN)).toBe(1000);
    });

    it('resolves a reference through the resolver', () => {
        const resolve = (ref: string) => (ref === 'joint.total' ? 5000 : NaN);
        expect(resolveAmount({ ref: 'joint.total' }, resolve)).toBe(5000);
    });

    it('resolves a reference that points at another row (e.g. an income row)', () => {
        const incomes = [
            { id: 'i1', amountMonth: 297800 },
            { id: 'i2', amountMonth: 50000 },
        ];
        // A stand-in resolver: parse '<domain>.<id>.<metric>' and read that row.
        const resolve = (ref: string) => {
            const [domain, id, metric] = ref.split('.');

            if (domain === 'income' && metric === 'amountMonth') {
                return incomes.find((r) => r.id === id)?.amountMonth ?? NaN;
            }

            return NaN;
        };
        expect(resolveAmount({ ref: 'income.i1.amountMonth' }, resolve)).toBe(297800);
        // Dangling reference (row gone) → NaN, which the UI renders as "—".
        expect(resolveAmount({ ref: 'income.gone.amountMonth' }, resolve)).toBeNaN();
    });

    it('isRef distinguishes references from literals', () => {
        expect(isRef(1000)).toBe(false);
        expect(isRef({ ref: 'x' })).toBe(true);
    });
});
