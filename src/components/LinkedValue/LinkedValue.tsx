import { Link2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './LinkedValue.module.scss'

interface Props {
  value: ReactNode
  /** Where the value comes from, e.g. "Joint · Total rounded". */
  source: string
  onClick?: () => void
}

/** A linked amount: link icon + value, with its source underneath. Clickable in edit mode. */
export default function LinkedValue({ value, source, onClick }: Props) {
  const content = (
    <>
      <span className={styles.value}>
        <Link2 size={13} strokeWidth={1.5} />
        {value}
      </span>
      <span className={styles.source}>{source}</span>
    </>
  )

  return onClick ? (
    <button type="button" className={cx(styles.linked, styles.clickable)} onClick={onClick}>
      {content}
    </button>
  ) : (
    <span className={styles.linked}>{content}</span>
  )
}
