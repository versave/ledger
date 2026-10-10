import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './Button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `default`: white bordered button ("+ Add …"). `toggle`: deep-green text, brass when active. */
  variant?: 'default' | 'toggle'
  active?: boolean
  icon?: ReactNode
}

export default function Button({ variant = 'default', active, icon, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(styles.button, styles[variant], active && styles.active, className)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
