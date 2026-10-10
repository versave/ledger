import type { PGlite } from '@electric-sql/pglite'
import type { Income, IncomePatch, NewIncome } from '../types'

const COLUMNS = 'id, name, amount, currency, frequency, usage'

/** Database access for income sources. */
export class IncomeRepo {
  constructor(private readonly db: PGlite) {}

  async list(): Promise<Income[]> {
    const { rows } = await this.db.query<Income>(
      `SELECT ${COLUMNS} FROM income ORDER BY created_at`,
    )
    return rows
  }

  async create(input: NewIncome): Promise<Income> {
    const { rows } = await this.db.query<Income>(
      `INSERT INTO income (name, amount, currency, frequency, usage)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLUMNS}`,
      [
        input.name ?? '',
        Math.round(input.amount ?? 0),
        input.currency ?? 'EUR',
        input.frequency ?? 'Month',
        input.usage ?? '',
      ],
    )
    return rows[0]
  }

  /** Update only the provided fields; returns the updated row, or null if not found. */
  async update(id: string, patch: IncomePatch): Promise<Income | null> {
    const sets: string[] = []
    const values: unknown[] = []
    const set = (col: string, value: unknown) => {
      values.push(value)
      sets.push(`${col} = $${values.length}`)
    }

    if (patch.name !== undefined) {
      set('name', patch.name)
    }
    if (patch.amount !== undefined) {
      set('amount', Math.round(patch.amount))
    }
    if (patch.currency !== undefined) {
      set('currency', patch.currency)
    }
    if (patch.frequency !== undefined) {
      set('frequency', patch.frequency)
    }
    if (patch.usage !== undefined) {
      set('usage', patch.usage)
    }

    if (sets.length === 0) {
      const { rows } = await this.db.query<Income>(
        `SELECT ${COLUMNS} FROM income WHERE id = $1`,
        [id],
      )
      return rows[0] ?? null
    }

    values.push(id)
    const { rows } = await this.db.query<Income>(
      `UPDATE income SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING ${COLUMNS}`,
      values,
    )
    return rows[0] ?? null
  }

  async remove(id: string): Promise<void> {
    await this.db.query('DELETE FROM income WHERE id = $1', [id])
  }
}
