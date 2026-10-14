import { Hono } from 'hono';
import type { Repos } from '../repos';
import { type Amount, isRef } from '../../shared/amount';
import { isValidRef } from '../../shared/ref';
import type {
    JointExpense,
    JointExpenseBody,
    ResolvedJointExpense,
} from '../../shared/joint-expense';
import { makeRefResolver } from '../resolve-refs';

function parseAmount(v: unknown): Amount | undefined {
    if (typeof v === 'number') {
        return v;
    }

    if (v && typeof v === 'object' && typeof (v as { ref?: unknown }).ref === 'string') {
        return { ref: (v as { ref: string }).ref };
    }

    return undefined;
}

function parseSplit(v: unknown): Record<string, number> | null {
    if (!v || typeof v !== 'object') {
        return null;
    }

    const out: Record<string, number> = {};

    for (const [personId, pct] of Object.entries(v as Record<string, unknown>)) {
        out[personId] = Number(pct);
    }

    return out;
}

/** 400 message when an amount is a ref whose format isn't recognised, else null. */
function refFormatError(amount: Amount | undefined): string | null {
    if (amount !== undefined && isRef(amount) && !isValidRef(amount.ref)) {
        return `unknown ref format: '${amount.ref}'`;
    }

    return null;
}

/** Routes for joint (shared) expenses, mounted under /joint-expenses. Responses resolve ref amounts. */
export function jointExpenseRoutes(repos: Repos): Hono {
    const routes = new Hono();
    const repo = repos.jointExpense;

    // Load the snapshot the resolver needs (incomes + people drive slices; joint expenses feed the pool).
    const loadData = async () => {
        const [incomes, people, jointExpenses] = await Promise.all([
            repos.income.list(),
            repos.people.list(),
            repo.list(),
        ]);
        return { incomes, people, jointExpenses };
    };

    // GET /joint-expenses  ->  ResolvedJointExpense[]
    routes.get('/', async (ctx) => {
        const data = await loadData();
        const { resolveAmount } = makeRefResolver(data);
        const resolved: ResolvedJointExpense[] = data.jointExpenses.map((je) => ({
            ...je,
            amount: resolveAmount(je.amount),
        }));

        return ctx.json(resolved);
    });

    // POST /joint-expenses   body: JointExpenseBody  ->  ResolvedJointExpense (201)
    routes.post('/', async (ctx) => {
        const body = await ctx.req.json<JointExpenseBody>().catch(() => ({}) as JointExpenseBody);
        const amount = parseAmount(body.amount);
        const refErr = refFormatError(amount);

        if (refErr) {
            return ctx.json({ error: refErr }, 400);
        }

        const expense: JointExpense = await repo.create({
            name: typeof body.name === 'string' ? body.name : undefined,
            amount,
            split: body.split === undefined ? undefined : parseSplit(body.split),
        });
        const { resolveAmount } = makeRefResolver(await loadData());

        return ctx.json({ ...expense, amount: resolveAmount(expense.amount) }, 201);
    });

    // PATCH /joint-expenses/:id   body: JointExpenseBody  ->  ResolvedJointExpense (404 if missing)
    routes.patch('/:id', async (c) => {
        const body = await c.req.json<JointExpenseBody>().catch(() => ({}) as JointExpenseBody);
        const patch: JointExpenseBody = {};

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

        if (body.split !== undefined) {
            patch.split = parseSplit(body.split);
        }

        const expense = await repo.update(c.req.param('id'), patch);

        if (!expense) {
            return c.json({ error: 'not found' }, 404);
        }

        const { resolveAmount } = makeRefResolver(await loadData());

        return c.json({ ...expense, amount: resolveAmount(expense.amount) });
    });

    // DELETE /joint-expenses/:id  ->  204 No Content
    routes.delete('/:id', async (c) => {
        await repo.remove(c.req.param('id'));
        return c.body(null, 204);
    });

    return routes;
}
