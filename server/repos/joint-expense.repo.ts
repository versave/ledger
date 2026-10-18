import type { PGlite } from '@electric-sql/pglite';
import { type Amount, isRef } from '../../shared/amount';
import type { JointExpense, JointExpenseBody } from '../types';
import { ExpenseRow, rowToAmount } from './expense.repo-shared.ts';

const SELECT = `SELECT id, name, amount_cents AS "amountCents", amount_ref AS "amountRef" FROM joint_expense`;

const amountToColumns = (amount: Amount): { cents: number | null; ref: string | null } =>
    isRef(amount) ? { cents: null, ref: amount.ref } : { cents: Math.round(amount), ref: null };

/** Database access for joint (shared) expenses and their per-person splits. */
export class JointExpenseRepo {
    constructor(private readonly db: PGlite) {}

    async list(): Promise<JointExpense[]> {
        const { rows } = await this.db.query<ExpenseRow>(`${SELECT} ORDER BY created_at`);
        const splits = await this.allSplits();

        return rows.map((r) => ({
            id: r.id,
            name: r.name,
            amount: rowToAmount(r),
            split: splits.get(r.id) ?? null,
        }));
    }

    async create(input: JointExpenseBody): Promise<JointExpense> {
        const { cents, ref } = amountToColumns(input.amount ?? 0);
        const { rows } = await this.db.query<{ id: string }>(
            `INSERT INTO joint_expense (name, amount_cents, amount_ref) VALUES ($1, $2, $3) RETURNING id`,
            [input.name ?? '', cents, ref],
        );
        const id = rows[0].id;

        if (input.split) {
            await this.replaceSplits(id, input.split);
        }

        return (await this.get(id)) as JointExpense;
    }

    /** Update provided fields; `split` (when present) replaces all splits, `null` clears them. */
    async update(id: string, patch: JointExpenseBody): Promise<JointExpense | null> {
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
                `UPDATE joint_expense SET ${sets.join(', ')} WHERE id = $${values.length}`,
                values,
            );
        }

        if (patch.split !== undefined) {
            await this.db.query('DELETE FROM joint_expense_split WHERE expense_id = $1', [id]);

            if (patch.split) {
                await this.replaceSplits(id, patch.split);
            }
        }

        return this.get(id);
    }

    async remove(id: string): Promise<void> {
        await this.db.query('DELETE FROM joint_expense WHERE id = $1', [id]);
    }

    private async get(id: string): Promise<JointExpense | null> {
        const { rows } = await this.db.query<ExpenseRow>(`${SELECT} WHERE id = $1`, [id]);
        const row = rows[0];

        if (!row) {
            return null;
        }

        return {
            id: row.id,
            name: row.name,
            amount: rowToAmount(row),
            split: await this.splitsFor(id),
        };
    }

    private async replaceSplits(id: string, split: Record<string, number>): Promise<void> {
        await this.db.query('DELETE FROM joint_expense_split WHERE expense_id = $1', [id]);

        for (const [personId, pct] of Object.entries(split)) {
            await this.db.query(
                'INSERT INTO joint_expense_split (expense_id, person_id, pct) VALUES ($1, $2, $3)',
                [id, personId, pct],
            );
        }
    }

    private async splitsFor(id: string): Promise<Record<string, number> | null> {
        const { rows } = await this.db.query<{ personId: string; pct: number }>(
            `SELECT person_id AS "personId", pct FROM joint_expense_split WHERE expense_id = $1`,
            [id],
        );
        return rows.length > 0 ? this.toSplitMap(rows) : null;
    }

    private async allSplits(): Promise<Map<string, Record<string, number>>> {
        const { rows } = await this.db.query<{ expenseId: string; personId: string; pct: number }>(
            `SELECT expense_id AS "expenseId", person_id AS "personId", pct FROM joint_expense_split`,
        );
        const map = new Map<string, Record<string, number>>();

        for (const r of rows) {
            const m = map.get(r.expenseId) ?? {};
            m[r.personId] = Number(r.pct);
            map.set(r.expenseId, m);
        }

        return map;
    }

    private toSplitMap(rows: { personId: string; pct: number }[]): Record<string, number> {
        const map: Record<string, number> = {};

        for (const r of rows) {
            map[r.personId] = Number(r.pct);
        }

        return map;
    }
}
