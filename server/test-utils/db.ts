import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'db', 'migrations');

/** A fresh in-memory PGlite with all migrations applied, for isolated repo tests. */
export async function makeTestDb(): Promise<PGlite> {
    const db = new PGlite();
    await db.waitReady;
    const files = readdirSync(MIGRATIONS_DIR)
        .filter((f) => f.endsWith('.sql'))
        .sort();
    for (const file of files) {
        await db.exec(readFileSync(join(MIGRATIONS_DIR, file), 'utf8'));
    }
    return db;
}
