import { PGlite } from '@electric-sql/pglite'
import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
export const DATA_DIR = join(here, '..', '..', 'data')
const MIGRATIONS_DIR = join(here, 'migrations')

/** Apply any migration scripts not yet recorded in schema_version. */
async function migrate(db: PGlite): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version
    (
      filename
      TEXT
      PRIMARY
      KEY,
      applied_at
      TIMESTAMPTZ
      NOT 
      NULL
      DEFAULT
      now
    (
    )
      );
  `)

  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith('.sql')).sort()
  const { rows } = await db.query<{ filename: string }>('SELECT filename FROM schema_version')
  const applied = new Set(rows.map((r) => r.filename))

  for (const file of files) {
    if (applied.has(file)) {
      continue
    }
    const sql = await readFile(join(MIGRATIONS_DIR, file), 'utf8')
    await db.transaction(async (tx) => {
      await tx.exec(sql)
      await tx.query('INSERT INTO schema_version (filename) VALUES ($1)', [file])
    })
    console.log(`[db] applied migration ${file}`)
  }
}

/** Open the PGlite database (data in DATA_DIR) and run pending migrations. */
export async function connect(): Promise<PGlite> {
  const db = new PGlite(DATA_DIR)
  await db.waitReady
  await migrate(db)
  console.log(`[db] ready (data in ${DATA_DIR})`)
  return db
}
