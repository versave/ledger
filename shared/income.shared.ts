export interface IncomeHolderTotals {
    id: string;
    holder: {
        id: string;
        name: string;
    };
    amountMonth: number;
    amountYear: number;
    currency: string;
}
