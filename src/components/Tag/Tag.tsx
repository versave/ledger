import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './Tag.module.scss'

interface Props {
  tone?: 'brass' | 'subtle'
  children: ReactNode
}

/** Pill used for read-mode states such as "Custom" split or loan status. */
export default function Tag({ tone = 'brass', children }: Props) {
  return <span className={cx(styles.tag, styles[tone])}>{children}</span>
}
