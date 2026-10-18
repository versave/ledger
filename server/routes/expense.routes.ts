import { Hono } from 'hono';
import type { Repos } from '../repos';
import type { Expense, ExpenseBody, ResolvedExpense } from '../../shared/expense';
import { loadData, parseAmount, refFormatError } from './expense-shared.routes.ts';
import { makeRefResolver } from '../resolve-refs.ts';

export function expenseRoutes(repos: Repos): Hono {
    const routes = new Hono();
    const repo = repos.expense;

    routes.get('/', async (ctx) => {
        const data = await loadData(repos);
        const expensesList = await repo.list();
        const { resolveAmount } = makeRefResolver(data);
        const resolved: ResolvedExpense[] = expensesList.map((exp) => ({
            ...exp,
            amount: resolveAmount(exp.amount),
        }));

        return ctx.json(resolved);
    });

    routes.post('/', async (ctx) => {
        const body = await ctx.req.json<ExpenseBody>().catch(() => ({}) as ExpenseBody);
        const amount = parseAmount(body.amount);
        const refErr = refFormatError(amount);

        if (refErr) {
            return ctx.json({ error: refErr }, 400);
        }

        const expense: Expense = await repo.create({
            name: typeof body.name === 'string' ? body.name : undefined,
            amount,
        });
        const { resolveAmount } = makeRefResolver(await loadData(repos));

        return ctx.json({ ...expense, amount: resolveAmount(expense.amount) }, 201);
    });

    routes.patch('/:id', async (c) => {
        const body = await c.req.json<ExpenseBody>().catch(() => ({}) as ExpenseBody);
        const patch: ExpenseBody = {};

        if (typeof body.name === 'string') {
            patch.name = body.name;
        }

        const amount = parseAmount(body.amount);
        const refErr = refFormatError(amount);

        if (refErr) {
            return c.json({ error: refErr }, 400);
        }

        if (amount !== undefined) {
            patch.amount = amount;
        }

        const expense = await repo.update(c.req.param('id'), patch);

        if (!expense) {
            return c.json({ error: 'not found' }, 404);
        }

        const { resolveAmount } = makeRefResolver(await loadData(repos));

        return c.json({ ...expense, amount: resolveAmount(expense.amount) });
    });

    routes.delete('/:id', async (c) => {
        await repo.remove(c.req.param('id'));
        return c.body(null, 204);
    });

    return routes;
}
