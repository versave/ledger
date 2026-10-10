import { useMemo, useState } from 'react'
import { cx } from '../../utils/cx'
import { formatEUR } from '../../utils/format'
import Button from '../Button/Button'
import Label from '../Label/Label'
import Modal from '../Modal/Modal'
import styles from './LinkPicker.module.scss'

export interface LinkOption {
  /** Computed key, e.g. `joint.totalRounded`. */
  key: string
  /** Page group, e.g. "Joint spread". */
  group: string
  label: string
  value: number
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** All linkable values; exclude the cell being edited before passing them in. */
  options: LinkOption[]
  currentKey?: string
  onPick: (key: string) => void
  /** "Unlink, keep value": shown only when the cell is currently linked. */
  onUnlink?: () => void
}

export default function LinkPicker({ open, onOpenChange, options, currentKey, onPick, onUnlink }: Props) {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const byGroup = new Map<string, LinkOption[]>()
    for (const o of options) {
      if (q && !`${o.group} ${o.label}`.toLowerCase().includes(q)) continue
      byGroup.set(o.group, [...(byGroup.get(o.group) ?? []), o])
    }
    return [...byGroup]
  }, [options, query])

  const close = () => onOpenChange(false)

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) setQuery('')
        onOpenChange(next)
      }}
      title="Link to a value"
      description="This amount will follow the source you pick and update whenever it changes."
      footer={
        <>
          {currentKey && onUnlink && (
            <Button
              onClick={() => {
                onUnlink()
                close()
              }}
            >
              Unlink, keep value
            </Button>
          )}
          <Button variant="primary" onClick={close}>
            Cancel
          </Button>
        </>
      }
    >
      <input
        className={styles.search}
        placeholder="Search fields"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <div className={styles.list}>
        {groups.length === 0 && <div className={styles.empty}>No matching values</div>}
        {groups.map(([group, items]) => (
          <div key={group}>
            <div className={styles.groupLabel}>
              <Label>{group}</Label>
            </div>
            {items.map((o) => (
              <button
                key={o.key}
                type="button"
                className={cx(styles.option, o.key === currentKey && styles.current)}
                onClick={() => {
                  onPick(o.key)
                  close()
                }}
              >
                <span className={styles.optionLabel}>{o.label}</span>
                <span className={styles.optionValue}>{formatEUR(o.value)}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  )
}
