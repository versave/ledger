import type { PGlite } from '@electric-sql/pglite';
import { type Amount, isRef } from '../../shared/amount';
import { Expense, ExpenseBody } from '../../shared/expense.ts';
import { ExpenseRow, rowToAmount } from './expense.repo-shared.ts';

const SELECT = `SELECT id, name, amount_cents AS "amountCents", amount_ref AS "amountRef" FROM personal_expense`;

const amountToColumns = (amount: Amount): { cents: number | null; ref: string | null } =>
    isRef(amount) ? { cents: null, ref: amount.ref } : { cents: Math.round(amount), ref: null };

export class ExpenseRepo {
    constructor(private readonly db: PGlite) {}

    public async list(): Promise<Expense[]> {
        const { rows } = await this.db.query<ExpenseRow>(`${SELECT} ORDER BY created_at`);

        return rows.map((r) => ({
            id: r.id,
            name: r.name,
            amount: rowToAmount(r),
        }));
    }

    public async create(input: ExpenseBody): Promise<Expense> {
        const { cents, ref } = amountToColumns(input.amount ?? 0);
        const { rows } = await this.db.query<{ id: string }>(
            `INSERT INTO personal_expense (name, amount_cents, amount_ref) VALUES ($1, $2, $3) RETURNING id`,
            [input.name ?? '', cents, ref],
        );
        const id = rows[0].id;

        return (await this.get(id)) as Expense;
    }

    public async update(id: string, patch: ExpenseBody): Promise<Expense | null> {
        if (!(await this.get(id))) {
            return null;
        }

        const sets: string[] = [];
        const values: unknown[] = [];
        const set = (col: string, value: unknown) => {
            values.push(value);
            sets.push(`${col} = $${values.length}`);
        };

        if (patch.name !== undefined) {
            set('name', patch.name);
        }

        if (patch.amount !== undefined) {
            const { cents, ref } = amountToColumns(patch.amount);
            set('amount_cents', cents);
            set('amount_ref', ref);
        }

        if (sets.length > 0) {
            values.push(id);

            await this.db.query(
                `UPDATE personal_expense SET ${sets.join(', ')} WHERE id = $${values.length}`,
                values,
            );
        }

        return this.get(id);
    }

    public async remove(id: string): Promise<void> {
        await this.db.query('DELETE FROM personal_expense WHERE id = $1', [id]);
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
