import { Amount } from '../../shared/amount.ts';

export interface ExpenseRow {
    id: string;
    name: string;
    amountCents: number | null;
    amountRef: string | null;
}

export const rowToAmount = (row: ExpenseRow): Amount =>
    row.amountRef != null ? { ref: row.amountRef } : (row.amountCents ?? 0);
