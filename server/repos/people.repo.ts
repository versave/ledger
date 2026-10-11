import type { PGlite } from '@electric-sql/pglite'
import type { NewPerson, Person, PersonPatch } from '../types'

const COLUMNS = 'id, name'

/** Database access for people. */
export class PeopleRepo {
  constructor(private readonly db: PGlite) {}

  async list(): Promise<Person[]> {
    const { rows } = await this.db.query<Person>(
      `SELECT ${COLUMNS} FROM people ORDER BY created_at`,
    )
    return rows
  }

  async create(input: NewPerson): Promise<Person> {
    const { rows } = await this.db.query<Person>(
      `INSERT INTO people (name) VALUES ($1) RETURNING ${COLUMNS}`,
      [input.name ?? ''],
    )
    return rows[0]
  }

  async update(id: string, patch: PersonPatch): Promise<Person | null> {
    if (patch.name === undefined) {
      const { rows } = await this.db.query<Person>(
        `SELECT ${COLUMNS} FROM people WHERE id = $1`,
        [id],
      )
      return rows[0] ?? null
    }
    const { rows } = await this.db.query<Person>(
      `UPDATE people SET name = $1 WHERE id = $2 RETURNING ${COLUMNS}`,
      [patch.name, id],
    )
    return rows[0] ?? null
  }

  async remove(id: string): Promise<void> {
    await this.db.query('DELETE FROM people WHERE id = $1', [id])
  }
}
