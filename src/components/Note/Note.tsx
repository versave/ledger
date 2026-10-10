import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './Note.module.scss'

interface Props {
  /** Adds the panel-body margin (0 22px 20px) when placed at the bottom of a Panel. */
  inset?: boolean
  children: ReactNode
}

/** Brass-tinted callout, e.g. "Over-assigned by €120,00. Lower a bucket to balance the spread." */
export default function Note({ inset, children }: Props) {
  return <div className={cx(styles.note, inset && styles.inset)}>{children}</div>
}
