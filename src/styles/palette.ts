// Chart colours as literal strings for SVG fills (Recharts), where CSS variables
// aren't reliable. Keep in sync with the --chart-* tokens in _tokens.scss.

export const CHART_PALETTE = [
  'oklch(0.83 0.16 88)',
  'oklch(0.55 0.07 150)',
  'oklch(0.68 0.12 70)',
  'oklch(0.76 0.06 140)',
  'oklch(0.40 0.05 150)',
  'oklch(0.91 0.09 95)',
  'oklch(0.62 0.09 112)',
  'oklch(0.50 0.08 60)',
  'oklch(0.86 0.04 140)',
  'oklch(0.33 0.035 155)',
]

export const REMAINDER_COLOR = 'oklch(0.88 0.005 80)'
export const DEEP_GREEN = 'oklch(0.26 0.03 155)'

export const BAR_CURRENT = 'oklch(0.40 0.05 155)'
export const BAR_OTHER = 'oklch(0.76 0.06 140)'
export const BAR_NEGATIVE = 'oklch(0.68 0.12 70)'

/** Swatches offered by the colour popover: the chart palette + deep green + remainder grey. */
export const PICKER_SWATCHES = [...CHART_PALETTE, DEEP_GREEN, REMAINDER_COLOR]
