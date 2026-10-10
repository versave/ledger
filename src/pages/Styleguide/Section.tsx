import type { ReactNode } from 'react'
import { Label } from '../../components'
import styles from './Styleguide.module.scss'

export default function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <Label as="h2">{title}</Label>
      {children}
    </section>
  )
}
