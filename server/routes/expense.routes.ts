import { Hono } from 'hono';
import type { Repos } from '../repos';
import type { Expense, ExpenseBody } from '../../shared/expense';
import { loadData, parseAmount, refFormatError } from './expense-shared.routes.ts';
import { makeRefResolver } from '../resolve-refs.ts';

export function expenseRoutes(repos: Repos): Hono {
    const routes = new Hono();
    const repo = repos.expense;

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

    return routes;
}
