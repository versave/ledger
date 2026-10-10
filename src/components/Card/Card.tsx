import type { HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import styles from './Card.module.scss'

/** White surface with hairline border, radius 10 and a soft shadow. Base for KPIs and panels. */
export default function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.card, className)} {...rest} />
}
