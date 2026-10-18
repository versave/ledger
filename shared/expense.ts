import type { Amount } from './amount';
import type { RefValue } from './ref';

/** In API responses a ref amount is resolved to its value, keeping `ref` so it round-trips on save. */
export type ResolvedAmount = number | ({ ref: string } & RefValue);

export interface ResolvedExpense {
    id: string;
    name: string;
    amount: ResolvedAmount;
}

export interface ResolvedJointExpense extends ResolvedExpense {
    split: Record<string, number> | null;
}

export interface Expense {
    id: string;
    name: string;
    amount: Amount; // literal cents, or { ref }
}

export interface JointExpense extends Expense {
    split: Record<string, number> | null;
}

export interface ExpenseBody {
    name?: string;
    amount?: Amount;
}

export interface JointExpenseBody extends ExpenseBody {
    split?: Record<string, number> | null;
}
