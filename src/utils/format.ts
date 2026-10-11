// Money is handled as integer cents everywhere (DB, API, and FE state).
// These helpers convert to/from the human euro string (€2 978,00) only at the
// UI edge. NBSP thousands, comma decimals, U+2212 minus; non-finite → em dash.

const NBSP = ' '

const splitCents = (cents: number) => {
    const abs = Math.abs(Math.round(cents))
    return { int: Math.floor(abs / 100), dec: String(abs % 100).padStart(2, '0') }
}

/** Format integer cents as €2 978,00. */
export function formatEUR(cents: number): string {
    if (!Number.isFinite(cents)) {
        return '—'
    }
    const { int, dec } = splitCents(cents)
    const grouped = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
    return `${Math.round(cents) < 0 ? '−' : ''}€${grouped},${dec}`
}

export function formatPct(n: number): string {
    return Number.isFinite(n) ? `${n.toFixed(2).replace('.', ',')}%` : '—'
}

/** Editable text shown while an amount input has focus: 2978,00 (from integer cents). */
export function formatRaw(cents: number): string {
    if (!Number.isFinite(cents)) {
        return ''
    }
    const { int, dec } = splitCents(cents)
    return `${Math.round(cents) < 0 ? '-' : ''}${int},${dec}`
}

/** Parse a euro string to integer cents. Accepts 1.234,56 · 1234.56 · € 1 234 · −12. Invalid → 0. */
export function parseAmount(text: string): number {
    let s = text.replace(/[€\s]/g, '').replace('−', '-')
    if (s.includes(',')) {
        s = s.replace(/\./g, '').replace(',', '.')
    }
    const n = parseFloat(s)
    return Number.isFinite(n) ? Math.round(n * 100) : 0
}
