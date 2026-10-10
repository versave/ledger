import type { ElementType, ReactNode } from 'react'
import styles from './Label.module.scss'

interface Props {
  as?: ElementType
  children: ReactNode
}

/** 11px uppercase label: KPI labels, panel kickers, section headings. */
export default function Label({ as: Tag = 'div', children }: Props) {
  return <Tag className={styles.label}>{children}</Tag>
}
