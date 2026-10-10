import { Hono } from 'hono'
import type { Repos } from '../repos'
import { incomeRoutes } from './income.routes'
import { exportRoutes } from './export.routes'

/** Build the API: mount each domain's routes and a shared error handler. */
export function createApp(repos: Repos): Hono {
  const app = new Hono()

  app.route('/income', incomeRoutes(repos.income))
  app.route('/export', exportRoutes(repos.backup))

  // Surfaces validation errors and DB constraint failures as 400s.
  app.onError((err, c) => {
    console.error('[api]', err)
    return c.json({ error: err.message }, 400)
  })

  return app
}
