// A reference is a typed link to another value. It is STORED as a string (in the
// amount_ref TEXT column) but never handled as a raw string in code: parse it to a
// typed `Ref` at the boundary, build it with `ref.*`, and resolve it exhaustively.

export type Ref =
    | { kind: 'income'; incomeId: string }
    | { kind: 'jointExpense'; personId: string; rounded: boolean };

/** Uniform resolver output: an id (row id or computed key), a label, and the value in cents. */
export interface RefValue {
    id: string;
    name: string;
    value: number;
}

/** Builders — the only way code should construct refs (no hand-written strings). */
export const ref = {
    income: (incomeId: string): Ref => ({ kind: 'income', incomeId }),
    jointExpense: (personId: string, rounded: boolean): Ref => ({
        kind: 'jointExpense',
        personId,
        rounded,
    }),
};

/** Parse a stored string back to a typed ref, or null if it is unknown/malformed. */
export const parseRef = (refString: string): Ref | null => {
    const [kind, partA, partB] = refString.split(':');

    switch (kind) {
        case 'income':
            return partA ? { kind: 'income', incomeId: partA } : null;
        case 'jointExpense': {
            return partA && (partB === 'rounded' || partB === 'absolute')
                ? { kind: 'jointExpense', personId: partA, rounded: partB === 'rounded' }
                : null;
        }
        default:
            return null;
    }
};

/** True when a stored string is one of the recognised ref formats. */
export const isValidRef = (s: string): boolean => parseRef(s) !== null;
