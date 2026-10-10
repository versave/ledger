// Number formatting for EUR amounts, matching the prototype: €2 978,00
// (NBSP thousands, comma decimals, U+2212 minus). Non-finite values render as an em dash.

const NBSP = ' '

export function formatEUR(n: number): string {
  if (!Number.isFinite(n)) return '—'
  const negative = n < -0.004
  const [int, dec] = Math.abs(n).toFixed(2).split('.')
  return `${negative ? '−' : ''}€${int.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)},${dec}`
}

export function formatPct(n: number): string {
  return Number.isFinite(n) ? `${n.toFixed(2).replace('.', ',')}%` : '—'
}

/** Editable text shown while an amount input has focus: 2978,00 */
export function formatRaw(n: number): string {
  return Number.isFinite(n) ? n.toFixed(2).replace('.', ',') : ''
}

/** Accepts 1.234,56 · 1234.56 · € 1 234 · −12. Invalid input parses to 0. */
export function parseAmount(text: string): number {
  let s = text.replace(/[€\s  ]/g, '').replace('−', '-')
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  const n = parseFloat(s)
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0
}
