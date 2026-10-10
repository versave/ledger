import { getRequestListener } from '@hono/node-server'
import type { Connect } from 'vite'
import { connect } from './db/client'
import { startPgSocket } from './db/pg-socket'
import { makeRepos } from './repos'
import { createApp } from './routes'

/**
 * Boot the backend and return a connect-style handler to mount under /api in the
 * Vite dev server: opens PGlite, runs migrations, starts the WebStorm bridge, and
 * registers graceful shutdown (PGlite must close cleanly or its data dir can't reopen).
 */
export async function createApiHandler(): Promise<Connect.NextHandleFunction> {
  const db = await connect()
  const socket = await startPgSocket(db)
  const app = createApp(makeRepos(db))

  let closing = false
  const shutdown = async (): Promise<void> => {
    if (closing) {
      return
    }
    closing = true
    try {
      if (socket) {
        await socket.stop()
      }
      await db.close()
    } catch {
      /* best effort */
    }
    process.exit(0)
  }
  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)

  const listener = getRequestListener(app.fetch)
  return (req, res) => void listener(req, res)
}
