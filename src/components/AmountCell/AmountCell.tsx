import { Link2 } from 'lucide-react'
import { formatEUR } from '../../utils/format'
import AmountInput from '../AmountInput/AmountInput'
import LinkedValue from '../LinkedValue/LinkedValue'
import styles from './AmountCell.module.scss'

interface Props {
  /** The resolved number (literal, or the current value of the linked source). */
  value: number
  /** Present when the amount is linked; `source` is the label shown under the value. */
  link?: { source: string }
  editing: boolean
  onCommit?: (value: number) => void
  /** Opens the link picker. Without it, no link button is shown. */
  onLinkClick?: () => void
}

/**
 * The amount cell used across all tables:
 * - linked → LinkedValue (clickable in edit mode, keeps icon + source in read mode)
 * - read mode → formatted number
 * - edit mode → AmountInput + link button
 */
export default function AmountCell({ value, link, editing, onCommit, onLinkClick }: Props) {
  if (link) {
    return (
      <div className={styles.cell}>
        <LinkedValue value={formatEUR(value)} source={link.source} onClick={editing ? onLinkClick : undefined} />
      </div>
    )
  }

  if (!editing || !onCommit) {
    return <span className={styles.static}>{formatEUR(value)}</span>
  }

  return (
    <div className={styles.cell}>
      <AmountInput value={value} onCommit={onCommit} />
      {onLinkClick && (
        <button
          type="button"
          className={styles.linkButton}
          title="Link to another value"
          aria-label="Link to another value"
          onClick={onLinkClick}
        >
          <Link2 size={14} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}
