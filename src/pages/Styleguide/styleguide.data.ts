// Reference and sample data shown on the styleguide page. Token values mirror src/styles/_tokens.scss.

import type { DonutSegment, LinkOption, NetWorthPoint } from '../../components'
import { CHART_PALETTE, REMAINDER_COLOR } from '../../styles/palette'

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
  ...CHART_PALETTE.map((value, i) => ({ name: `Series ${i + 1}`, token: `--chart-${i + 1}`, value })),
  { name: 'Remainder', token: '--chart-remainder', value: REMAINDER_COLOR },
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

// ---- Component samples ----

export const SAMPLE_LINK_OPTIONS: LinkOption[] = [
  { key: 'income.totalM', group: 'Income', label: 'Total / month', value: 4250 },
  { key: 'income.totalY', group: 'Income', label: 'Total / year', value: 51000 },
  { key: 'joint.totalRounded', group: 'Joint spread', label: 'Total rounded', value: 520 },
  { key: 'joint.slice.p1.r', group: 'Joint spread', label: 'Alex · Rounded slice', value: 390 },
  { key: 'debt.car.payment', group: 'Debt', label: 'Car loan · Payment / M', value: 312.4 },
  { key: 'personal.bucket.savings', group: 'Personal spread', label: 'Savings bucket', value: 600 },
]

export const SAMPLE_DONUT: DonutSegment[] = [
  { key: 'expenses', label: 'Recurring expenses', value: 1870, color: CHART_PALETTE[0] },
  { key: 'savings', label: 'Savings', value: 600, color: CHART_PALETTE[1] },
  { key: 'investments', label: 'Investments', value: 900, color: CHART_PALETTE[2] },
  { key: 'fun', label: 'Entertainment', value: 400, color: CHART_PALETTE[3] },
  { key: 'rest', label: 'Left to assign', value: 480, color: REMAINDER_COLOR },
]

export const SAMPLE_NET_WORTH: NetWorthPoint[] = [
  { id: 'h1-2024', year: '2024', half: 'H1', value: -4200 },
  { id: 'h2-2024', year: '2024', half: 'H2', value: 8350 },
  { id: 'h1-2025', year: '2025', half: 'H1', value: 21900 },
  { id: 'h2-2025', year: '2025', half: 'H2', value: 30480 },
  { id: 'h1-2026', year: '2026', half: 'H1', value: 41275.5 },
]
