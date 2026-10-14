import type { PGlite } from '@electric-sql/pglite';

// Tables included in a full SQL dump, in dependency order. Extend as the schema grows.
const TABLES = ['people', 'income', 'joint_expense', 'joint_expense_split'] as const;

/** Produces SQL backups spanning every table. */
export class BackupRepo {
    constructor(private readonly db: PGlite) {}

    /** Dump all data as runnable SQL (psql -f) for backup / migration to real Postgres. */
    async exportSql(): Promise<string> {
        const esc = (v: unknown): string => {
            if (v === null || v === undefined) {
                return 'NULL';
            }
            if (typeof v === 'number' || typeof v === 'bigint') {
                return String(v);
            }
            if (v instanceof Date) {
                return `'${v.toISOString()}'`;
            }
            return `'${String(v).replace(/'/g, "''")}'`;
        };

        const lines: string[] = ['-- Ledger export', 'BEGIN;'];
        for (const table of TABLES) {
            const { rows, fields } = await this.db.query<Record<string, unknown>>(
                `SELECT * FROM ${table} ORDER BY created_at`,
            );
            const cols = fields.map((f) => f.name);
            for (const row of rows) {
                const values = cols.map((c) => esc(row[c])).join(', ');
                const colList = cols.map((c) => `"${c}"`).join(', ');
                lines.push(`INSERT INTO ${table} (${colList}) VALUES (${values});`);
            }
        }
        lines.push('COMMIT;', '');
        return lines.join('\n');
    }
}
