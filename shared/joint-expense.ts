import type { Amount } from './amount';
import type { RefValue } from './ref';

/** In API responses a ref amount is resolved to its value, keeping `ref` so it round-trips on save. */
export type ResolvedAmount = number | ({ ref: string } & RefValue);

/** A joint expense as returned by the API, with any ref amount resolved to { ref, id, name, value }. */
export interface ResolvedJointExpense {
    id: string;
    name: string;
    amount: ResolvedAmount;
    split: Record<string, number> | null;
}

/** A joint (shared) expense, as returned by the API (GET / POST / PATCH responses). */
export interface JointExpense {
    id: string;
    name: string;
    amount: Amount; // literal cents, or { ref }
    /** Custom per-person split (personId -> percent), or null for the default share. */
    split: Record<string, number> | null;
}

/**
 * Request body for POST (create) and PATCH (update) /joint-expenses.
 * All fields optional: PATCH updates only what is sent; `split: null` clears a custom split.
 */
export interface JointExpenseBody {
    name?: string;
    amount?: Amount;
    split?: Record<string, number> | null;
}
