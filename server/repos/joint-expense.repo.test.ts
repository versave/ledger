import { describe, it, expect, beforeEach } from 'vitest';
import type { PGlite } from '@electric-sql/pglite';
import { makeTestDb } from '../test-utils/db';
import { JointExpenseRepo } from './joint-expense.repo';

describe('JointExpenseRepo', () => {
    let db: PGlite;
    let repo: JointExpenseRepo;
    let p1: string;
    let p2: string;

    const addPerson = async (name: string) =>
        (await db.query<{ id: string }>(`INSERT INTO people (name) VALUES ($1) RETURNING id`, [name]))
            .rows[0].id;

    beforeEach(async () => {
        db = await makeTestDb();
        repo = new JointExpenseRepo(db);
        p1 = await addPerson('Alex');
        p2 = await addPerson('Sam');
    });

    it('creates a literal expense with no split', async () => {
        const e = await repo.create({ name: 'Internet', amount: 6000 });
        expect(e.name).toBe('Internet');
        expect(e.amount).toBe(6000);
        expect(e.split).toBeNull();
    });

    it('creates an expense with a reference amount', async () => {
        const e = await repo.create({ name: 'Linked', amount: { ref: 'joint.totalRounded' } });
        expect(e.amount).toEqual({ ref: 'joint.totalRounded' });
    });

    it('stores and returns a custom split', async () => {
        const e = await repo.create({ name: 'Groceries', amount: 22500, split: { [p1]: 70, [p2]: 30 } });
        expect(e.split).toEqual({ [p1]: 70, [p2]: 30 });
    });

    it('lists expenses in creation order', async () => {
        await repo.create({ name: 'A', amount: 1000 });
        await repo.create({ name: 'B', amount: 2000 });
        const all = await repo.list();
        expect(all.map((e) => e.name)).toEqual(['A', 'B']);
    });

    it('updates fields and replaces the split', async () => {
        const e = await repo.create({ name: 'X', amount: 1000, split: { [p1]: 50, [p2]: 50 } });
        const u = await repo.update(e.id, { amount: 1500, split: { [p1]: 100, [p2]: 0 } });
        expect(u?.amount).toBe(1500);
        expect(u?.split).toEqual({ [p1]: 100, [p2]: 0 });
    });

    it('clears the split when set to null', async () => {
        const e = await repo.create({ name: 'X', amount: 1000, split: { [p1]: 50, [p2]: 50 } });
        const u = await repo.update(e.id, { split: null });
        expect(u?.split).toBeNull();
    });

    it('switches a literal amount to a reference on update', async () => {
        const e = await repo.create({ name: 'X', amount: 1000 });
        const u = await repo.update(e.id, { amount: { ref: 'joint.totalRounded' } });
        expect(u?.amount).toEqual({ ref: 'joint.totalRounded' });
    });

    it('returns null when updating a missing expense', async () => {
        expect(await repo.update('nope', { name: 'x' })).toBeNull();
    });

    it('deletes an expense and its splits', async () => {
        const e = await repo.create({ name: 'X', amount: 1000, split: { [p1]: 50, [p2]: 50 } });
        await repo.remove(e.id);
        expect(await repo.list()).toHaveLength(0);
        const splits = await db.query(`SELECT * FROM joint_expense_split`);
        expect(splits.rows).toHaveLength(0);
    });

    it('cascades split removal when a person is deleted', async () => {
        await repo.create({ name: 'X', amount: 1000, split: { [p1]: 50, [p2]: 50 } });
        await db.query(`DELETE FROM people WHERE id = $1`, [p1]);
        const [got] = await repo.list();
        expect(got.split).toEqual({ [p2]: 50 });
    });
});
