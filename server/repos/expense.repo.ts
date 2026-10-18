import type { PGlite } from '@electric-sql/pglite';
import { type Amount, isRef } from '../../shared/amount';
import { Expense, ExpenseBody } from '../../shared/expense.ts';
import { ExpenseRow, rowToAmount } from './expense.repo-shared.ts';

const SELECT = `SELECT id, name, amount_cents AS "amountCents", amount_ref AS "amountRef" FROM personal_expense`;

const amountToColumns = (amount: Amount): { cents: number | null; ref: string | null } =>
    isRef(amount) ? { cents: null, ref: amount.ref } : { cents: Math.round(amount), ref: null };

export class ExpenseRepo {
    constructor(private readonly db: PGlite) {}

    async create(input: ExpenseBody): Promise<Expense> {
        const { cents, ref } = amountToColumns(input.amount ?? 0);
        const { rows } = await this.db.query<{ id: string }>(
            `INSERT INTO personal_expense (name, amount_cents, amount_ref) VALUES ($1, $2, $3) RETURNING id`,
            [input.name ?? '', cents, ref],
        );
        const id = rows[0].id;

        return (await this.get(id)) as Expense;
    }

    private async get(id: string): Promise<Expense | null> {
        const { rows } = await this.db.query<ExpenseRow>(`${SELECT} WHERE id = $1`, [id]);
        const row = rows[0];

        if (!row) {
            return null;
        }

        return {
            id: row.id,
            name: row.name,
            amount: rowToAmount(row),
        };
    }
}
