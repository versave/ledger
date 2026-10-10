import { Card } from '../../../components'
import Section from '../Section'
import { CHART_SWATCHES, COLOR_GROUPS, type Swatch } from '../styleguide.data'
import styles from '../Styleguide.module.scss'

function SwatchCard({ swatch, compact }: { swatch: Swatch; compact?: boolean }) {
  return (
    <Card className={styles.swatch}>
      <div className={compact ? styles.chipSmall : styles.chip} style={{ background: `var(${swatch.token})` }} />
      <div className={styles.swatchMeta}>
        <strong>{swatch.name}</strong>
        <code>{swatch.token}</code>
        <span className={styles.muted}>{swatch.value}</span>
      </div>
    </Card>
  )
}

export default function Colors() {
  return (
    <Section title="Colours">
      {COLOR_GROUPS.map((g) => (
        <div key={g.title} className={styles.group}>
          <div className={styles.groupTitle}>{g.title}</div>
          <div className={styles.swatches}>
            {g.swatches.map((s) => (
              <SwatchCard key={s.token} swatch={s} />
            ))}
          </div>
        </div>
      ))}
      <div className={styles.group}>
        <div className={styles.groupTitle}>Chart palette (series order) + remainder</div>
        <div className={styles.chartSwatches}>
          {CHART_SWATCHES.map((s) => (
            <SwatchCard key={s.token} swatch={s} compact />
          ))}
        </div>
      </div>
    </Section>
  )
}
