import type { LucideIcon } from 'lucide-react'
import Card from '../Card/Card'
import styles from './EmptyState.module.scss'

interface Props {
  icon: LucideIcon
  title: string
  text?: string
}

export default function EmptyState({ icon: Icon, title, text }: Props) {
  return (
    <Card className={styles.empty}>
      <Icon size={28} strokeWidth={1.5} />
      <div className={styles.title}>{title}</div>
      {text && <p className={styles.text}>{text}</p>}
    </Card>
  )
}
