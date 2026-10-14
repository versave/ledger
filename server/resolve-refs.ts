import { type Amount, isRef } from '../shared/amount';
import { parseRef, resolveRef, type RefSources, type RefValue } from '../shared/ref';
import { incomeShares, sliceActual, sliceRounded, type JointExpenseCalc } from '../shared/calc';
import type { ResolvedAmount } from '../shared/joint-expense';
import type { Income, JointExpense, Person } from './types';

const STEP_CENTS = 1000; // round the joint total up to the nearest €10
const PCT_STEP = 5; // round income shares to the nearest 5%

export interface ResolverData {
    incomes: Income[];
    people: Person[];
    jointExpenses: JointExpense[];
}

/**
 * Builds a resolver over the current data snapshot. Turns a stored Amount into its
 * response form: a literal stays a number; a ref becomes { ref, id, name, value }.
 */
export function makeRefResolver(data: ResolverData) {
    // Resolve amounts *inside* joint expenses: income refs look up the row; a slice ref
    // inside a joint amount would be circular, so it contributes 0 (cycle guard).
    const leafResolve = (refString: string): number => {
        const r = parseRef(refString);

        if (!r) {
            return NaN;
        }

        if (r.kind === 'income') {
            return data.incomes.find((i) => i.id === r.incomeId)?.amountMonth ?? NaN;
        }

        return 0;
    };

    const calcExpenses: JointExpenseCalc[] = data.jointExpenses.map((e) => ({
        amount: e.amount,
        split: e.split,
    }));

    const incomeByPerson: Record<string, number> = {};

    for (const p of data.people) {
        incomeByPerson[p.id] = 0;
    }

    for (const i of data.incomes) {
        if (i.holder && i.holder in incomeByPerson) {
            incomeByPerson[i.holder] += i.amountMonth;
        }
    }

    const shares = incomeShares(incomeByPerson, PCT_STEP);

    const sources: RefSources = {
        income: (incomeId) => {
            const inc = data.incomes.find((i) => i.id === incomeId);
            return { id: incomeId, name: inc?.name ?? '—', value: inc?.amountMonth ?? NaN };
        },
        jointExpense: (personId, rounded) => {
            const person = data.people.find((p) => p.id === personId);
            const value = rounded
                ? sliceRounded(
                      calcExpenses,
                      personId,
                      leafResolve,
                      shares.rounded[personId] ?? 0,
                      STEP_CENTS,
                  )
                : sliceActual(calcExpenses, personId, leafResolve, shares.actual[personId] ?? 0);
            return { id: personId, name: person ? `${person.name} · slice` : '—', value };
        },
    };

    const resolveAmount = (amount: Amount): ResolvedAmount => {
        if (!isRef(amount)) {
            return amount;
        }

        const parsed = parseRef(amount.ref);
        const value: RefValue = parsed
            ? resolveRef(parsed, sources)
            : { id: amount.ref, name: '—', value: NaN };

        return { ref: amount.ref, ...value };
    };

    return { resolveAmount };
}
