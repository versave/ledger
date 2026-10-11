import { Hono } from 'hono'
import type { PeopleRepo } from '../repos/people.repo'
import type { PersonPatch } from '../types'

/** Routes for people, mounted under /people. */
export function peopleRoutes(repo: PeopleRepo): Hono {
  const routes = new Hono()

  routes.get('/', async (c) => c.json(await repo.list()))

  routes.post('/', async (c) => {
    const body = await c.req.json().catch(() => ({}))
    const person = await repo.create({
      name: typeof body.name === 'string' ? body.name : undefined,
    })
    return c.json(person, 201)
  })

  routes.patch('/:id', async (c) => {
    const body = await c.req.json().catch(() => ({}))
    const patch: PersonPatch = {}
    if (typeof body.name === 'string') {
      patch.name = body.name
    }

    const person = await repo.update(c.req.param('id'), patch)
    if (!person) {
      return c.json({ error: 'not found' }, 404)
    }
    return c.json(person)
  })

  routes.delete('/:id', async (c) => {
    await repo.remove(c.req.param('id'))
    return c.body(null, 204)
  })

  return routes
}
