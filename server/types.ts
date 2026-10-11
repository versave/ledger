import { FREQUENCIES, type Frequency } from '../shared/enums'

// Re-export the shared enum so server modules can keep importing from './types'.
export { FREQUENCIES, type Frequency }

export interface Income {
  id: string
  name: string
  amountMonth: number // monthly amount, integer cents
  currency: string
  frequency: Frequency
  usage: string
}

export interface NewIncome {
  name?: string
  amountMonth?: number
  currency?: string
  frequency?: Frequency
  usage?: string
}

export type IncomePatch = NewIncome
