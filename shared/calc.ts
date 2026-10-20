// Pure joint-spread calculations, shared by the client (live, while editing) and,
// if ever needed, the server (read-only summaries). All money is integer cents.
import { type Amount, resolveAmount } from './amount';

export interface JointExpenseCalc {
    amount: Amount;
    /** Custom per-person split (personId -> percent), or null to use the default share. */
    split: Record<string, number> | null;
}

type Resolve = (ref: string) => number;

export const sum = (ns: number[]): number => ns.reduce((s, n) => s + n, 0);

/** Sum of every joint expense (resolved to cents). */
export const jointTotal = (expenses: JointExpenseCalc[], resolve: Resolve): number =>
    sum(expenses.map((e) => resolveAmount(e.amount, resolve)));

/** Round cents up to the nearest step (e.g. 1000 = nearest €10). */
export const roundUpTo = (cents: number, stepCents: number): number =>
    stepCents > 0 ? Math.ceil(cents / stepCents) * stepCents : cents;

export const jointTotalRounded = (
    expenses: JointExpenseCalc[],
    resolve: Resolve,
    stepCents: number,
): number => roundUpTo(jointTotal(expenses, resolve), stepCents);

/** Sum of expenses that carry a custom split (they're allocated by their own split, not the pool). */
export const customTotal = (expenses: JointExpenseCalc[], resolve: Resolve): number =>
    sum(expenses.filter((e) => e.split).map((e) => resolveAmount(e.amount, resolve)));

/** The percent a person pays of an expense: its custom split if any, else the default rounded share. */
export const splitPct = (
    expense: JointExpenseCalc,
    personId: string,
    defaultRoundedShare: number,
): number => (expense.split ? (expense.split[personId] ?? 0) : defaultRoundedShare);

/** Income-proportional shares: actual percentages and ones rounded to `pctStep`. */
export const incomeShares = (
    incomeByPerson: Record<string, number>,
    pctStep: number,
): { actual: Record<string, number>; rounded: Record<string, number> } => {
    const total = sum(Object.values(incomeByPerson));
    const actual: Record<string, number> = {};
    const rounded: Record<string, number> = {};
    for (const [pid, income] of Object.entries(incomeByPerson)) {
        const pct = total > 0 ? (income / total) * 100 : 0;
        actual[pid] = pct;
        rounded[pid] = pctStep > 0 ? Math.round(pct / pctStep) * pctStep : pct;
    }
    return { actual, rounded };
};

/** A person's cents from custom-split expenses (allocated by each expense's own split). */
const customShareFor = (expenses: JointExpenseCalc[], personId: string, resolve: Resolve): number =>
    sum(
        expenses
            .filter((e) => e.split)
            .map((e) => (resolveAmount(e.amount, resolve) * (e.split![personId] ?? 0)) / 100),
    );

/** A person's actual slice: their share of the pooled expenses plus their custom portions. */
export const sliceActual = (
    expenses: JointExpenseCalc[],
    personId: string,
    resolve: Resolve,
    shareActualPct: number,
): number => {
    const pooled = jointTotal(expenses, resolve) - customTotal(expenses, resolve);
    return (pooled * shareActualPct) / 100 + customShareFor(expenses, personId, resolve);
};

/** A person's rounded slice: uses the rounded joint total for the pooled part. */
export const sliceRounded = (
    expenses: JointExpenseCalc[],
    personId: string,
    resolve: Resolve,
    shareRoundedPct: number,
    stepCents: number,
): number => {
    const pooled = jointTotalRounded(expenses, resolve, stepCents) - customTotal(expenses, resolve);
    return (pooled * shareRoundedPct) / 100 + customShareFor(expenses, personId, resolve);
};
