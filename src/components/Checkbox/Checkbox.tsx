import { Check } from 'lucide-react'
import { cx } from '../../utils/cx'
import styles from './Checkbox.module.scss'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Accessible name; also shown as tooltip. */
  label: string
}

/** Round 22px check, e.g. the custom-split toggle on Joint spread. */
export default function Checkbox({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      title={label}
      className={cx(styles.checkbox, checked && styles.checked)}
      onClick={() => onChange(!checked)}
    >
      {checked && <Check size={13} strokeWidth={2.25} />}
    </button>
  )
}
