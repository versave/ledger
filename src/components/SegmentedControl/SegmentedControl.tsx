import { cx } from '../../utils/cx'
import styles from './SegmentedControl.module.scss'

export interface SegmentOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
}

interface Props<T extends string> {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
}

/** e.g. H1 | H2, Nominal | Today's euros. */
export default function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className={styles.segmented} role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={cx(styles.segment, o.value === value && styles.selected)}
          disabled={o.disabled}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
