import type { SelectHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import styles from './Select.module.scss'
import { ChevronDown } from 'lucide-react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    options: (string | { value: string; label: string })[]
}

/** Small bordered select used in table cells (Monthly/Yearly, Active/Planned/Paid off…). */
export default function Select({ options, className, ...rest }: Props) {
    return (
        <div className={styles.container}>
            <select className={cx(styles.select, className)} {...rest}>
                {options.map((o) => {
                    const { value, label } = typeof o === 'string' ? { value: o, label: o } : o

                    return (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    )
                })}
            </select>

            <ChevronDown className={styles.icon} size={20} />
        </div>
    )
}
