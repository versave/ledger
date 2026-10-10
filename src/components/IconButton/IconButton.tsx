import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './IconButton.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  /** Accessible name; also shown as tooltip. */
  label: string
}

/** 28px ghost button, e.g. the row delete ×. */
export default function IconButton({ icon, label, className, ...rest }: Props) {
  return (
    <button type="button" className={cx(styles.iconButton, className)} aria-label={label} title={label} {...rest}>
      {icon}
    </button>
  )
}
