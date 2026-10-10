import { useState } from 'react'
import { DonutChart, NetWorthChart, Panel, SegmentedControl } from '../../../components'
import { formatEUR } from '../../../utils/format'
import Section from '../Section'
import { SAMPLE_DONUT, SAMPLE_NET_WORTH } from '../styleguide.data'

export default function Charts() {
  const [segments, setSegments] = useState(SAMPLE_DONUT)
  const [view, setView] = useState<'nominal' | 'real'>('nominal')
  const income = segments.reduce((sum, s) => sum + s.value, 0)

  return (
    <Section title="Charts · Recharts">
      <Panel kicker="Where your income goes" title="DonutChart" sub="Hover a segment; click a legend dot to recolour">
        <DonutChart
          segments={segments}
          centerValue={formatEUR(income)}
          centerLabel="Monthly income"
          onColorChange={(key, color) => setSegments((ss) => ss.map((s) => (s.key === key ? { ...s, color } : s)))}
        />
      </Panel>
      <Panel
        title="Net worth over time"
        sub={`${SAMPLE_NET_WORTH.length} reviews · NetWorthChart`}
        actions={
          <SegmentedControl
            options={[
              { value: 'nominal', label: 'Nominal' },
              { value: 'real', label: "Today's euros" },
            ]}
            value={view}
            onChange={setView}
          />
        }
      >
        <NetWorthChart points={SAMPLE_NET_WORTH} currentId="h1-2026" />
      </Panel>
    </Section>
  )
}
