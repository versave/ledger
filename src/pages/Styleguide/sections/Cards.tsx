import { Inbox } from 'lucide-react'
import { useState } from 'react'
import { AmountInput, EmptyState, KpiCard, Note, Panel, SummaryList } from '../../../components'
import { formatEUR } from '../../../utils/format'
import Section from '../Section'
import styles from '../Styleguide.module.scss'

export default function Cards() {
  const [income, setIncome] = useState(425000)

  return (
    <Section title="Cards">
      <div className={styles.kpis}>
        <KpiCard label="Income" value="€4 250,00" sub="per month" />
        <KpiCard label="Left to assign" value="−€120,00" sub="Over-allocated" tone="warn" />
        <KpiCard
          label="Monthly income (editable)"
          value={<AmountInput variant="kpi" value={income} onCommit={setIncome} aria-label="Monthly income" />}
          sub="User-defined per review"
        />
      </div>

      <div className={styles.split}>
        <Panel title="Transfer per account" sub="SummaryList">
          <SummaryList
            items={[
              { label: 'Entertainment / Personal', sub: '3 fixed · 1 offset', value: formatEUR(64000) },
              { label: 'Joint', sub: '2 fixed', value: formatEUR(152000) },
              { label: 'Investments', sub: 'Nothing to transfer', value: formatEUR(-3500), color: 'var(--warn)' },
            ]}
          />
        </Panel>
        <Panel title="Panel with a Note" sub="Note (inset)">
          <Note inset>Over-assigned by €120,00. Lower a bucket to balance the spread.</Note>
        </Panel>
      </div>

      <EmptyState icon={Inbox} title="Nothing here yet" text="EmptyState: shown when a page or table has no content." />
    </Section>
  )
}
