import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import type { PGlite } from '@electric-sql/pglite'

/**
 * Expose the *same* live PGlite instance over the Postgres wire protocol so GUI
 * clients (WebStorm/DataGrip, psql) can connect. PGlite allows only one instance
 * per data dir, so we share this one rather than reopening it. Disable with
 * LEDGER_NO_PG_SOCKET=1; override host/port with LEDGER_PG_HOST / LEDGER_PG_PORT.
 */
export async function startPgSocket(db: PGlite): Promise<PGLiteSocketServer | null> {
  if (process.env.LEDGER_NO_PG_SOCKET === '1') {
    return null
  }

  const port = Number(process.env.LEDGER_PG_PORT) || 5433
  const host = process.env.LEDGER_PG_HOST || '127.0.0.1'

  // GUI clients open several connections at once; the default limit of 1 refuses
  // the rest with 08001. PGlite still runs one query at a time (queued).
  const server = new PGLiteSocketServer({ db, port, host, maxConnections: 20 })
  try {
    await server.start()
    console.log(`[db] postgres wire protocol on ${host}:${port} (user/db: any) — connect WebStorm here`)
    return server
  } catch (err) {
    console.warn(`[db] could not start pg socket on ${host}:${port}: ${(err as Error).message}`)
    return null
  }
}
