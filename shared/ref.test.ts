import { describe, it, expect } from 'vitest';
import {
    formatRef,
    isValidRef,
    parseRef,
    ref,
    resolveRef,
    type Ref,
    type RefSources,
} from './ref';

describe('ref', () => {
    it('round-trips every kind through format -> parse', () => {
        const cases: Ref[] = [ref.income('i1'), ref.jointExpense('p1', true), ref.jointExpense('p2', false)];
        for (const r of cases) {
            expect(parseRef(formatRef(r))).toEqual(r);
        }
    });

    it('formats to a stable, readable string', () => {
        expect(formatRef(ref.income('i1'))).toBe('income:i1');
        expect(formatRef(ref.jointExpense('p1', true))).toBe('jointExpense:p1:rounded');
        expect(formatRef(ref.jointExpense('p1', false))).toBe('jointExpense:p1:absolute');
    });

    it('returns null for garbage or unknown refs', () => {
        expect(parseRef('')).toBeNull();
        expect(parseRef('nonsense')).toBeNull();
        expect(parseRef('jointExpense:p1:x')).toBeNull();
        expect(parseRef('income')).toBeNull();
    });

    it('isValidRef accepts known formats and rejects unknown ones', () => {
        expect(isValidRef('income:i1')).toBe(true);
        expect(isValidRef('jointExpense:p1:rounded')).toBe(true);
        expect(isValidRef('income.test')).toBe(false); // dot-notation, not a real format
        expect(isValidRef('')).toBe(false);
    });

    it('resolveRef dispatches to the matching source and returns {id,name,value}', () => {
        const sources: RefSources = {
            income: (id) => ({ id, name: 'Salary', value: 297800 }),
            jointExpense: (pid, rounded) => ({ id: pid, name: `slice ${rounded ? 'r' : 'a'}`, value: 5000 }),
        };
        expect(resolveRef(ref.income('i1'), sources)).toEqual({ id: 'i1', name: 'Salary', value: 297800 });
        expect(resolveRef(ref.jointExpense('p1', true), sources).name).toBe('slice r');
    });
});
