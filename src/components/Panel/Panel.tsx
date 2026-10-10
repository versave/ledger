import type { ReactNode } from 'react'
import Card from '../Card/Card'
import Label from '../Label/Label'
import styles from './Panel.module.scss'

interface Props {
  title: string
  kicker?: string
  sub?: ReactNode
  /** Right side of the header: segmented control, "+ Add …" button. */
  actions?: ReactNode
  children?: ReactNode
}

/** Card with a header (kicker, title, sub, actions); body is usually a Table or chart. */
export default function Panel({ title, kicker, sub, actions, children }: Props) {
  return (
    <Card className={styles.panel}>
      <header className={styles.head}>
        <div className={styles.titles}>
          {kicker && <Label>{kicker}</Label>}
          <h3 className={styles.title}>{title}</h3>
          {sub && <div className={styles.sub}>{sub}</div>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>
      {children}
    </Card>
  )
}
