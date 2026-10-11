import { Hono } from 'hono'
import type { IncomeRepo } from '../repos/income.repo'
import { FREQUENCIES, type Frequency, type IncomePatch } from '../types'

function parseFrequency(v: unknown): Frequency | undefined {
  if (FREQUENCIES.includes(v as Frequency)) {
    return v as Frequency
  }
  return undefined
}

/** Routes for income sources, mounted under /income. */
export function incomeRoutes(repo: IncomeRepo): Hono {
  const routes = new Hono()

  routes.get('/', async (c) => c.json(await repo.list()))

  routes.post('/', async (c) => {
    const body = await c.req.json().catch(() => ({}))
    if (body.frequency !== undefined && parseFrequency(body.frequency) === undefined) {
      return c.json({ error: "frequency must be 'Month' or 'Year'" }, 400)
    }
    const income = await repo.create({
      name: typeof body.name === 'string' ? body.name : undefined,
      amountMonth: body.amountMonth !== undefined ? Number(body.amountMonth) : undefined,
      currency: typeof body.currency === 'string' ? body.currency : undefined,
      frequency: parseFrequency(body.frequency),
      usage: typeof body.usage === 'string' ? body.usage : undefined,
    })
    return c.json(income, 201)
  })

  routes.patch('/:id', async (c) => {
    const body = await c.req.json().catch(() => ({}))
    if (body.frequency !== undefined && parseFrequency(body.frequency) === undefined) {
      return c.json({ error: "frequency must be 'Month' or 'Year'" }, 400)
    }
    const patch: IncomePatch = {}
    if (typeof body.name === 'string') {
      patch.name = body.name
    }
    if (body.amountMonth !== undefined) {
      patch.amountMonth = Number(body.amountMonth)
    }
    if (typeof body.currency === 'string') {
      patch.currency = body.currency
    }
    if (body.frequency !== undefined) {
      patch.frequency = parseFrequency(body.frequency)
    }
    if (typeof body.usage === 'string') {
      patch.usage = body.usage
    }

    const income = await repo.update(c.req.param('id'), patch)
    if (!income) {
      return c.json({ error: 'not found' }, 404)
    }
    return c.json(income)
  })

  routes.delete('/:id', async (c) => {
    await repo.remove(c.req.param('id'))
    return c.body(null, 204)
  })

  return routes
}
