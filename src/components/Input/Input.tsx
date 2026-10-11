import { forwardRef, type InputHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import styles from './Input.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    /**
     * `cell`: inline table input, transparent until hovered (15px).
     * `subtle`: same, but 14px muted text for secondary columns (e.g. Usage).
     * `kpi`: large bold input inside a KPI card.
     */
    variant?: 'cell' | 'subtle' | 'kpi'
    /** Right-aligned, tabular figures. */
    numeric?: boolean
}

const Input = forwardRef<HTMLInputElement, Props>(function Input(
    { variant = 'cell', numeric, className, ...rest },
    ref,
) {
    return (
        <input
            ref={ref}
            className={cx(styles.input, styles[variant], numeric && styles.numeric, className)}
            inputMode={numeric ? 'decimal' : undefined}
            {...rest}
        />
    )
})

export default Input
