import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import styles from './ColorDot.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: string
}

/**
 * 14px series colour dot (legends, bucket rows). Renders as a button so it can
 * be wrapped in ColorPopover; without onClick/trigger it's inert.
 */
const ColorDot = forwardRef<HTMLButtonElement, Props>(function ColorDot({ color, className, style, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx(styles.dot, className)}
      style={{ ...style, background: color }}
      {...rest}
    />
  )
})

export default ColorDot
