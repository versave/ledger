export type Frequency = 'Month' | 'Year'

export const FREQUENCIES: Frequency[] = ['Month', 'Year']

export interface Income {
  id: string
  name: string
  amount: number // monthly amount, integer cents
  currency: string
  frequency: Frequency
  usage: string
}

export interface NewIncome {
  name?: string
  amount?: number
  currency?: string
  frequency?: Frequency
  usage?: string
}

export type IncomePatch = NewIncome
