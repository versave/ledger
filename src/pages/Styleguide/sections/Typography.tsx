import { Card } from '../../../components'
import Section from '../Section'
import { TYPE_SCALE } from '../styleguide.data'
import styles from '../Styleguide.module.scss'

export default function Typography() {
  return (
    <Section title="Type · Barlow">
      <Card className={styles.type}>
        {TYPE_SCALE.map((t) => (
          <div key={t.token} className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <code>{t.token}</code>
              <span className={styles.muted}>
                {t.size}px / {t.weight} · {t.role}
              </span>
            </div>
            <div
              className={styles.typeSample}
              style={{
                fontSize: `var(${t.token})`,
                fontWeight: t.weight,
                letterSpacing: t.upper ? '0.1em' : undefined,
                textTransform: t.upper ? 'uppercase' : undefined,
              }}
            >
              {t.sample}
            </div>
          </div>
        ))}
        <div className={styles.typeRow}>
          <div className={styles.typeMeta}>
            <code>--font-heading</code>
            <span className={styles.muted}>Barlow Condensed · available, not used in UI yet</span>
          </div>
          <div className={`${styles.typeSample} ${styles.heading}`}>Net worth review — H1 2026</div>
        </div>
      </Card>
    </Section>
  )
}
