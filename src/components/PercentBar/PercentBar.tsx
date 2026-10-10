import { formatPct } from '../../utils/format'
import styles from './PercentBar.module.scss'

interface Props {
  /** Percentage, 0–100. Values outside are clamped for the bar, shown as-is in the label. */
  value: number
  color?: string
}

/** Small progress bar + percentage, used for "% of income" columns. */
export default function PercentBar({ value, color = 'var(--chart-2)' }: Props) {
  const width = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0
  return (
    <div className={styles.percentBar}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${width}%`, background: color }} />
      </div>
      <span className={styles.text}>{formatPct(value)}</span>
    </div>
  )
}
