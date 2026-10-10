import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts'
import { BAR_CURRENT, BAR_NEGATIVE, BAR_OTHER } from '../../styles/palette'
import { formatEUR } from '../../utils/format'
import styles from './NetWorthChart.module.scss'

export interface NetWorthPoint {
  id: string
  year: string
  half: 'H1' | 'H2'
  value: number
}

interface Props {
  points: NetWorthPoint[]
  /** The review being viewed; drawn in the accent colour. */
  currentId?: string
}

const BAR_W = 76
const HALF_GAP = 3
const YEAR_GAP = 40
const GROUP_W = BAR_W * 2 + HALF_GAP + YEAR_GAP
const PLOT_H = 150
const TOP = 24 // room for value labels
const AXIS_H = 54 // H labels + hairline + year

const MUTED = 'color-mix(in srgb, var(--text) 60%, transparent)'
const INK = 'var(--green-ink)'

type Half = NetWorthPoint['half']
interface YearRow {
  year: string
  current: boolean
  H1?: number
  H2?: number
  points: Partial<Record<Half, NetWorthPoint>>
}

/** Grouped H1/H2 bars per year, scrolling horizontally when it overflows. Negative values show as a brass stub. */
export default function NetWorthChart({ points, currentId }: Props) {
  const max = Math.max(0, ...points.map((p) => p.value))
  const stub = max * 0.04

  const rows: YearRow[] = []
  for (const p of points) {
    let row = rows.find((r) => r.year === p.year)
    if (!row) rows.push((row = { year: p.year, current: false, points: {} }))
    row.points[p.half] = p
    row[p.half] = p.value < 0 ? stub : p.value
    if (p.id === currentId) row.current = true
  }

  const fill = (p?: NetWorthPoint) =>
    !p ? 'transparent' : p.value < 0 ? BAR_NEGATIVE : p.id === currentId ? BAR_CURRENT : BAR_OTHER

  const bar = (half: Half) => (
    <Bar dataKey={half} barSize={BAR_W} radius={[6, 6, 2, 2]} minPointSize={3} isAnimationActive={false}>
      {rows.map((r) => (
        <Cell key={r.year} fill={fill(r.points[half])} />
      ))}
      <LabelList
        dataKey={half}
        content={({ x, y, width, index }) => {
          const p = index != null ? rows[index]?.points[half] : undefined
          if (!p) return null
          return (
            <text
              x={Number(x) + Number(width) / 2}
              y={Number(y) - 8}
              textAnchor="middle"
              className={styles.value}
              style={{ fill: p.id === currentId ? INK : MUTED }}
            >
              {formatEUR(p.value)}
            </text>
          )
        }}
      />
    </Bar>
  )

  return (
    <div className={styles.scroller}>
      <BarChart
        width={Math.max(rows.length, 1) * GROUP_W}
        height={TOP + PLOT_H + AXIS_H}
        data={rows}
        margin={{ top: TOP, right: 0, bottom: 0, left: 0 }}
        barGap={HALF_GAP}
      >
        <YAxis hide domain={[0, max || 1]} />
        <XAxis
          dataKey="year"
          height={AXIS_H}
          axisLine={false}
          tickLine={false}
          interval={0}
          tick={({ x, y, index }) => {
            const row = rows[index]
            if (!row) return <g />
            const cx = Number(x)
            const top = Number(y)
            const offset = (BAR_W + HALF_GAP) / 2
            const color = row.current ? INK : MUTED
            return (
              <g>
                {(['H1', 'H2'] as const).map((h, i) => {
                  const p = row.points[h]
                  if (!p) return null
                  return (
                    <text
                      key={h}
                      x={cx + (i === 0 ? -offset : offset)}
                      y={top + 8}
                      textAnchor="middle"
                      className={styles.half}
                      style={{ fill: p.id === currentId ? INK : MUTED }}
                    >
                      {h}
                    </text>
                  )
                })}
                <line x1={cx - BAR_W - HALF_GAP / 2} x2={cx + BAR_W + HALF_GAP / 2} y1={top + 18} y2={top + 18} className={styles.rule} />
                <text x={cx} y={top + 38} textAnchor="middle" className={styles.year} style={{ fill: color }}>
                  {row.year}
                </text>
              </g>
            )
          }}
        />
        {bar('H1')}
        {bar('H2')}
      </BarChart>
    </div>
  )
}
