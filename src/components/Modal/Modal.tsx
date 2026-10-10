import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import styles from './Modal.module.scss'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** Right-aligned action buttons. */
  footer?: ReactNode
  children?: ReactNode
}

/** Centered dialog on a 40% backdrop. Esc / backdrop click close it; focus is trapped while open. */
export default function Modal({ open, onOpenChange, title, description, footer, children }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} {...(!description && { 'aria-describedby': undefined })}>
          <div>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            {description && <Dialog.Description className={styles.description}>{description}</Dialog.Description>}
          </div>
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
