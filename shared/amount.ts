// An amount is either a literal (integer cents) or a reference to a computed value.
// References are opaque computed-key strings resolved at read time, never stored as numbers.
export type Amount = number | { ref: string };

export const isRef = (a: Amount): a is { ref: string } => typeof a === 'object' && a !== null;

/** Turn an amount into a number: literals pass through; refs go through the resolver. */
export const resolveAmount = (a: Amount, resolve: (ref: string) => number): number =>
    isRef(a) ? resolve(a.ref) : a;
