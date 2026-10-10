import type { ReactNode } from 'react'
import styles from './SummaryList.module.scss'

export interface SummaryItem {
  label: string
  sub?: string
  value: ReactNode
  /** CSS colour for the value, e.g. var(--warn). */
  color?: string
}

/** Label / value rows used as a panel body (e.g. per-account transfer summary). */
export default function SummaryList({ items }: { items: SummaryItem[] }) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <div key={item.label} className={styles.row}>
          <div className={styles.labels}>
            <div className={styles.label}>{item.label}</div>
            {item.sub && <div className={styles.sub}>{item.sub}</div>}
          </div>
          <div className={styles.value} style={{ color: item.color }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}
