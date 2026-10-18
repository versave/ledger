import { Amount, isRef } from '../../shared/amount.ts';
import { isValidRef } from '../../shared/ref.ts';
import { Repos } from '../repos';

export const parseAmount = (v: unknown): Amount | undefined => {
    if (typeof v === 'number') {
        return v;
    }

    if (v && typeof v === 'object' && typeof (v as { ref?: unknown }).ref === 'string') {
        return { ref: (v as { ref: string }).ref };
    }

    return undefined;
};

/** 400 message when an amount is a ref whose format isn't recognised, else null. */
export const refFormatError = (amount: Amount | undefined): string | null => {
    if (amount !== undefined && isRef(amount) && !isValidRef(amount.ref)) {
        return `unknown ref format: '${amount.ref}'`;
    }

    return null;
};

// Load the snapshot the resolver needs (incomes + people drive slices; joint expenses feed the pool).
export const loadData = async (repos: Repos) => {
    const [incomes, people, jointExpenses] = await Promise.all([
        repos.income.list(),
        repos.people.list(),
        repos.jointExpense.list(),
    ]);
    return { incomes, people, jointExpenses };
};
