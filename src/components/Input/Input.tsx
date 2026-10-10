import { forwardRef, type InputHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import styles from './Input.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  /** Right-aligned, tabular figures. */
  numeric?: boolean
}

/** Inline table-cell input: transparent until hovered, white with green border on focus. */
const Input = forwardRef<HTMLInputElement, Props>(function Input({ numeric, className, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={cx(styles.input, numeric && styles.numeric, className)}
      inputMode={numeric ? 'decimal' : undefined}
      {...rest}
    />
  )
})

export default Input
