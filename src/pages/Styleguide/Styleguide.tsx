import { Plus, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import {
  Button,
  Card,
  EditToggle,
  IconButton,
  Input,
  KpiCard,
  Label,
  LinkedValue,
  Panel,
  SegmentedControl,
  Select,
  Table,
  Tag,
  Td,
  Th,
} from '../../components'
import PageHeader from '../../layout/PageHeader/PageHeader'
import { CHART_SWATCHES, COLOR_GROUPS, RADII, TYPE_SCALE, type Swatch } from './styleguide.data'
import styles from './Styleguide.module.scss'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <Label as="h2">{title}</Label>
      {children}
    </section>
  )
}

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

const plus = <Plus size={14} strokeWidth={1.75} />

export default function Styleguide() {
  const [editing, setEditing] = useState(false)
  const [half, setHalf] = useState<'H1' | 'H2'>('H1')

  return (
    <>
      <PageHeader
        title="Styleguide"
        desc="Design tokens and the reusable components in src/components. Tokens live in src/styles/_tokens.scss."
      />

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
          <div className={styles.groupTitle}>Chart palette (series order) + remainder · oklch</div>
          <div className={styles.chartSwatches}>
            {CHART_SWATCHES.map((s) => (
              <SwatchCard key={s.token} swatch={s} compact />
            ))}
          </div>
        </div>
      </Section>

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

      <Section title="Radii & elevation">
        <div className={styles.radii}>
          {RADII.map((r) => (
            <div key={r.token} className={styles.radius} style={{ borderRadius: `var(${r.token})` }}>
              <code>{r.token}</code>
              <span className={styles.muted}>{r.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Controls">
        <Card className={styles.demoRow}>
          <Button icon={plus}>Add expense</Button>
          <EditToggle editing={editing} onToggle={() => setEditing(!editing)} />
          <SegmentedControl
            options={[
              { value: 'H1', label: 'H1' },
              { value: 'H2', label: 'H2' },
            ]}
            value={half}
            onChange={setHalf}
          />
          <Select options={['Monthly', 'Yearly']} defaultValue="Monthly" />
          <IconButton icon={<X size={14} strokeWidth={1.5} />} label="Delete" />
          <Tag>Custom</Tag>
          <Tag tone="subtle">Default</Tag>
          <Input placeholder="Inline text input" className={styles.demoText} />
          <Input numeric defaultValue="€2 978,00" className={styles.demoAmount} />
        </Card>
      </Section>

      <Section title="KPI cards">
        <div className={styles.kpis}>
          <KpiCard label="Income" value="€4 250,00" sub="per month" />
          <KpiCard label="Monthly expenses" value="€1 870,00" sub="44,00% of income" />
          <KpiCard label="Left to assign" value="−€120,00" sub="Over-allocated" tone="warn" />
        </div>
      </Section>

      <Section title="Panel + table">
        <Panel kicker="Personal spread" title="Recurring monthly expenses" sub="3 items" actions={<Button icon={plus}>Add expense</Button>}>
          <Table minWidth={520}>
            <thead>
              <tr>
                <Th>Expense</Th>
                <Th numeric>Amount</Th>
                <Th numeric>Percentage</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Rent</Td>
                <Td numeric>€1 200,00</Td>
                <Td numeric muted>
                  28,24%
                </Td>
              </tr>
              <tr>
                <Td>Joint expenses slice</Td>
                <Td numeric>
                  <LinkedValue value="€520,00" source="Joint · Total rounded" />
                </Td>
                <Td numeric muted>
                  12,24%
                </Td>
              </tr>
              <tr>
                <Td>Phone</Td>
                <Td numeric>€150,00</Td>
                <Td numeric muted>
                  3,53%
                </Td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <Td>Total monthly expenses</Td>
                <Td numeric>€1 870,00</Td>
                <Td numeric>44,00%</Td>
              </tr>
            </tfoot>
          </Table>
        </Panel>
      </Section>
    </>
  )
}
