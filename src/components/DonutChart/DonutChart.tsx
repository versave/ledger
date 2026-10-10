import type { ReactNode } from 'react'
import { Pie, PieChart, Tooltip } from 'recharts'
import { formatEUR, formatPct } from '../../utils/format'
import ColorDot from '../ColorDot/ColorDot'
import ColorPopover from '../ColorPopover/ColorPopover'
import styles from './DonutChart.module.scss'

export interface DonutSegment {
  /** Series key; colour changes are reported against it. */
  key: string
  label: string
  value: number
  color: string
}

interface Props {
  segments: DonutSegment[]
  centerValue: ReactNode
  centerLabel: string
  size?: 'default' | 'small'
  /** Makes legend dots open a colour popover. */
  onColorChange?: (key: string, color: string) => void
}

const SIZES = { default: 210, small: 160 }
// 0.6% of the ring between segments, as in the design.
const GAP_DEGREES = 360 * 0.006

interface Slice extends DonutSegment {
  fill: string
  share: number
}

/** Ring chart + legend ("Where your income goes"). Non-positive segments are left out of the ring. */
export default function DonutChart({ segments, centerValue, centerLabel, size = 'default', onColorChange }: Props) {
  const px = SIZES[size]
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0)
  const slices: Slice[] = segments.map((s) => ({
    ...s,
    fill: s.color,
    share: total > 0 ? (Math.max(0, s.value) / total) * 100 : 0,
  }))
  const ring = slices.filter((s) => s.value > 0)

  return (
    <div className={styles.figure}>
      <div className={styles.ring} style={{ width: px, height: px }}>
        <PieChart width={px} height={px}>
          <Pie
            data={ring}
            dataKey="value"
            nameKey="label"
            innerRadius={px * 0.34}
            outerRadius={px / 2}
            startAngle={90}
            endAngle={-270}
            paddingAngle={ring.length > 1 ? GAP_DEGREES : 0}
            stroke="none"
            isAnimationActive={false}
          />
          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              const slice = payload?.[0]?.payload as Slice | undefined
              if (!active || !slice) return null
              return (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipLabel}>
                    <span className={styles.swatch} style={{ background: slice.color }} />
                    {slice.label}
                  </div>
                  <div className={styles.tooltipValue}>
                    {formatEUR(slice.value)} <span>({formatPct(slice.share)})</span>
                  </div>
                </div>
              )
            }}
          />
        </PieChart>
        <div className={styles.center}>
          <div className={styles.centerValue}>{centerValue}</div>
          <div className={styles.centerLabel}>{centerLabel}</div>
        </div>
      </div>

      <div className={styles.legend}>
        {slices.map((s) => (
          <div key={s.key} className={styles.item}>
            <div className={styles.itemLabel}>
              {onColorChange ? (
                <ColorPopover color={s.color} onChange={(c) => onColorChange(s.key, c)}>
                  <ColorDot color={s.color} title={`Change colour of ${s.label}`} />
                </ColorPopover>
              ) : (
                <ColorDot color={s.color} disabled />
              )}
              <span>{s.label}</span>
            </div>
            <div className={styles.itemValue}>
              {formatEUR(s.value)} <span>({formatPct(s.share)})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
