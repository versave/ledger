import { FREQUENCIES, type Frequency } from '../shared/enums';

// Re-export the shared enum so server modules can keep importing from './types'.
export { FREQUENCIES, type Frequency };

export interface Income {
    id: string;
    name: string;
    amountMonth: number; // monthly amount, integer cents
    currency: string;
    frequency: Frequency;
    usage: string;
    holder: string | null; // people.id of the owner, or null
}

export interface NewIncome {
    name?: string;
    amountMonth?: number;
    currency?: string;
    frequency?: Frequency;
    usage?: string;
    holder?: string | null;
}

export type IncomePatch = NewIncome;

export interface Person {
    id: string;
    name: string;
}

export interface NewPerson {
    name?: string;
}

export type PersonPatch = NewPerson;

// Joint expense contract types live in shared/ (used by both the API and the client).
export type { JointExpense, JointExpenseBody } from '../shared/joint-expense';
