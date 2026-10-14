import { describe, it, expect } from 'vitest';
import {
    customTotal,
    incomeShares,
    jointTotal,
    jointTotalRounded,
    roundUpTo,
    sliceActual,
    sliceRounded,
    splitPct,
    type JointExpenseCalc,
} from './calc';

const lit = (cents: number, split: Record<string, number> | null = null): JointExpenseCalc => ({
    amount: cents,
    split,
});
const noRefs = () => NaN;

describe('joint calc', () => {
    const es: JointExpenseCalc[] = [lit(6000), lit(1135), lit(1000)]; // 81.35

    it('jointTotal sums resolved amounts', () => {
        expect(jointTotal(es, noRefs)).toBe(8135);
    });

    it('roundUpTo rounds up to the step', () => {
        expect(roundUpTo(8135, 1000)).toBe(9000);
        expect(roundUpTo(9000, 1000)).toBe(9000);
    });

    it('jointTotalRounded rounds the total up to the step', () => {
        expect(jointTotalRounded(es, noRefs, 1000)).toBe(9000);
    });

    it('customTotal sums only custom-split expenses', () => {
        const list = [lit(1000), lit(2000, { p1: 50, p2: 50 })];
        expect(customTotal(list, noRefs)).toBe(2000);
    });

    it('splitPct uses the custom split, else the default rounded share', () => {
        expect(splitPct(lit(1000, { p1: 70, p2: 30 }), 'p1', 50)).toBe(70);
        expect(splitPct(lit(1000), 'p1', 50)).toBe(50);
    });

    it('incomeShares computes actual and rounded percentages', () => {
        const { actual, rounded } = incomeShares({ p1: 3000, p2: 1000 }, 5);
        expect(actual.p1).toBe(75);
        expect(rounded.p1).toBe(75);
        expect(actual.p2).toBe(25);
    });

    it('sliceActual splits the pooled amount by share, plus the custom portion', () => {
        const list = [lit(8000), lit(2000, { p1: 100, p2: 0 })];
        expect(sliceActual(list, 'p1', noRefs, 75)).toBe(8000); // 75% of 80 + all 20
        expect(sliceActual(list, 'p2', noRefs, 25)).toBe(2000); // 25% of 80 + 0
    });

    it('sliceRounded uses the rounded total', () => {
        const list = [lit(8135)];
        expect(sliceRounded(list, 'p1', noRefs, 100, 1000)).toBe(9000);
    });
});
