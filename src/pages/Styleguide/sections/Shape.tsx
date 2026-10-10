import Section from '../Section'
import { RADII } from '../styleguide.data'
import styles from '../Styleguide.module.scss'

const SHADOWS = [
  { token: '--shadow-card', label: 'Cards' },
  { token: '--shadow-md', label: 'Popovers' },
  { token: '--shadow-lg', label: 'Modals' },
]

export default function Shape() {
  return (
    <Section title="Radii & elevation">
      <div className={styles.tiles}>
        {RADII.map((r) => (
          <div key={r.token} className={styles.tile} style={{ borderRadius: `var(${r.token})` }}>
            <code>{r.token}</code>
            <span className={styles.muted}>{r.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.tiles}>
        {SHADOWS.map((s) => (
          <div key={s.token} className={styles.tile} style={{ boxShadow: `var(${s.token})` }}>
            <code>{s.token}</code>
            <span className={styles.muted}>{s.label}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}
