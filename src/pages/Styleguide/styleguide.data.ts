// Reference data shown on the styleguide page. Values mirror src/styles/_tokens.scss.

export interface Swatch {
  name: string
  token: string
  value: string
}

export const COLOR_GROUPS: { title: string; swatches: Swatch[] }[] = [
  {
    title: 'Surfaces',
    swatches: [
      { name: 'Ground', token: '--ground', value: 'oklch(0.975 0.01 95)' },
      { name: 'Card', token: '--card', value: '#ffffff' },
      { name: 'Hairline', token: '--hairline', value: 'oklch(0.91 0.012 130)' },
      { name: 'Band', token: '--band', value: 'oklch(0.965 0.01 120)' },
    ],
  },
  {
    title: 'Greens',
    swatches: [
      { name: 'Deep green', token: '--green-deep', value: 'oklch(0.26 0.03 155)' },
      { name: 'Sidebar hover', token: '--green-hover', value: 'oklch(0.33 0.035 155)' },
      { name: 'Sidebar text', token: '--sidebar-text', value: 'oklch(0.86 0.02 110)' },
      { name: 'Accent / focus', token: '--green-accent', value: 'oklch(0.40 0.05 155)' },
      { name: 'Accent text', token: '--green-ink', value: 'oklch(0.36 0.04 155)' },
    ],
  },
  {
    title: 'Brass',
    swatches: [
      { name: 'Brass', token: '--brass', value: 'oklch(0.83 0.16 88)' },
      { name: 'Brass light', token: '--brass-light', value: 'oklch(0.92 0.09 92)' },
      { name: 'Brass tint', token: '--brass-tint', value: 'oklch(0.965 0.05 92)' },
      { name: 'Warning', token: '--warn', value: 'oklch(0.50 0.08 60)' },
    ],
  },
  {
    title: 'Text',
    swatches: [
      { name: 'Text', token: '--text', value: '#1d1f20' },
      { name: 'Muted', token: '--text-muted', value: 'text 60%' },
      { name: 'Faint', token: '--text-faint', value: 'text 40%' },
    ],
  },
]

export const CHART_SWATCHES: Swatch[] = [
  ...[
    '0.83 0.16 88',
    '0.55 0.07 150',
    '0.68 0.12 70',
    '0.76 0.06 140',
    '0.40 0.05 150',
    '0.91 0.09 95',
    '0.62 0.09 112',
    '0.50 0.08 60',
    '0.86 0.04 140',
    '0.33 0.035 155',
  ].map((value, i) => ({ name: `Series ${i + 1}`, token: `--chart-${i + 1}`, value })),
  { name: 'Remainder', token: '--chart-remainder', value: '0.88 0.005 80' },
]

export const TYPE_SCALE = [
  { token: '--fs-kpi', size: 26, weight: 700, role: 'KPI value', sample: '€2 978,00' },
  { token: '--fs-h1', size: 24, weight: 700, role: 'Page title (H1)', sample: 'Personal spread' },
  { token: '--fs-panel', size: 18, weight: 600, role: 'Panel title', sample: 'Recurring monthly expenses' },
  { token: '--fs-cell', size: 15, weight: 500, role: 'Nav, emphasised cells, totals', sample: 'Groceries €450,00' },
  { token: '--fs-body', size: 14, weight: 400, role: 'Body, cells, descriptions', sample: 'Recurring monthly expenses come off income first.' },
  { token: '--fs-sub', size: 13, weight: 400, role: 'Subtitles, table headers, buttons', sample: '6 sources · 2 linked' },
  { token: '--fs-caption', size: 12, weight: 400, role: 'Captions, tags', sample: 'Joint · Total rounded' },
  { token: '--fs-label', size: 11, weight: 600, role: 'Uppercase labels', sample: 'Monthly expenses', upper: true },
]

export const RADII = [
  { token: '--r-input', label: 'Input 6' },
  { token: '--r-btn', label: 'Button 8' },
  { token: '--r-card', label: 'Card 10' },
  { token: '--r-modal', label: 'Modal 12' },
  { token: '--r-pill', label: 'Pill 999' },
]
