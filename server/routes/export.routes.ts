import { Hono } from 'hono'
import type { BackupRepo } from '../repos/backup.repo'

/** SQL export endpoint, mounted under /export. */
export function exportRoutes(repo: BackupRepo): Hono {
  const routes = new Hono()

  routes.get('/', async (c) => {
    const sql = await repo.exportSql()
    return c.body(sql, 200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ledger-export.sql"',
    })
  })

  return routes
}
