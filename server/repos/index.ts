import type { PGlite } from '@electric-sql/pglite'
import { IncomeRepo } from './income.repo'
import { PeopleRepo } from './people.repo'
import { BackupRepo } from './backup.repo'

/** All repositories, grouped by domain. Routes receive this and never touch the db directly. */
export interface Repos {
  income: IncomeRepo
  people: PeopleRepo
  backup: BackupRepo
}

export function makeRepos(db: PGlite): Repos {
  return {
    income: new IncomeRepo(db),
    people: new PeopleRepo(db),
    backup: new BackupRepo(db),
  }
}
