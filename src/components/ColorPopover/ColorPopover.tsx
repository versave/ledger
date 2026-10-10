import * as Popover from '@radix-ui/react-popover'
import { useState, type ReactNode } from 'react'
import { PICKER_SWATCHES } from '../../styles/palette'
import { cx } from '../../utils/cx'
import Label from '../Label/Label'
import styles from './ColorPopover.module.scss'

interface Props {
  color: string
  onChange: (color: string) => void
  /** The trigger, usually a ColorDot. */
  children: ReactNode
  swatches?: string[]
}

const FALLBACK_HEX = '#3f6b4f'

/** Palette swatches + native colour input. Picking a swatch closes it; the custom input updates live. */
export default function ColorPopover({ color, onChange, children, swatches = PICKER_SWATCHES }: Props) {
  const [open, setOpen] = useState(false)
  const hex = /^#[0-9a-f]{6}$/i.test(color) ? color : FALLBACK_HEX

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content} side="bottom" align="start" sideOffset={6}>
          <Label>Colour</Label>
          <div className={styles.swatches}>
            {swatches.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                className={cx(styles.swatch, c === color && styles.selected)}
                style={{ background: c }}
                onClick={() => {
                  onChange(c)
                  setOpen(false)
                }}
              />
            ))}
          </div>
          <label className={styles.custom}>
            <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} />
            <span>Custom colour</span>
            <span className={styles.hex}>{hex}</span>
          </label>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
