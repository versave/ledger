import { Plus, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import {
  AmountInput,
  Button,
  Card,
  Checkbox,
  ColorDot,
  ColorPopover,
  EditToggle,
  IconButton,
  Input,
  SegmentedControl,
  Select,
  Tag,
} from '../../../components'
import { CHART_PALETTE } from '../../../styles/palette'
import Section from '../Section'
import styles from '../Styleguide.module.scss'

const plus = <Plus size={14} strokeWidth={1.75} />

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.demo}>
      <div className={styles.demoLabel}>{label}</div>
      <div className={styles.demoBody}>{children}</div>
    </div>
  )
}

export default function Controls() {
  const [editing, setEditing] = useState(false)
  const [half, setHalf] = useState<'H1' | 'H2'>('H1')
  const [checked, setChecked] = useState(true)
  const [amount, setAmount] = useState(2978)
  const [color, setColor] = useState(CHART_PALETTE[1])

  return (
    <Section title="Controls">
      <Card className={styles.demos}>
        <Demo label="Button · default / primary / dashed">
          <Button icon={plus}>Add expense</Button>
          <Button variant="primary">Cancel</Button>
          <Button variant="dashed" icon={<Plus size={12} strokeWidth={1.75} />}>
            H2
          </Button>
        </Demo>
        <Demo label="EditToggle">
          <EditToggle editing={editing} onToggle={() => setEditing(!editing)} />
        </Demo>
        <Demo label="SegmentedControl (H2 disabled)">
          <SegmentedControl
            options={[
              { value: 'H1', label: 'H1' },
              { value: 'H2', label: 'H2', disabled: true },
            ]}
            value={half}
            onChange={setHalf}
          />
          <SegmentedControl
            options={[
              { value: 'H1', label: 'Nominal' },
              { value: 'H2', label: "Today's euros" },
            ]}
            value={half}
            onChange={setHalf}
          />
        </Demo>
        <Demo label="Select">
          <Select options={['Monthly', 'Yearly']} defaultValue="Monthly" />
          <Select options={['Active', 'Planned', 'Paid off']} defaultValue="Active" />
        </Demo>
        <Demo label="Input · cell / subtle / month (hover, click to focus)">
          <Input placeholder="Name" defaultValue="Groceries" className={styles.w180} />
          <Input variant="subtle" placeholder="Usage" defaultValue="Household" className={styles.w180} />
          <Input type="month" numeric defaultValue="2024-03" className={styles.w180} />
        </Demo>
        <Demo label="AmountInput (focus → raw, Enter/blur commits, Esc reverts)">
          <div className={styles.w180}>
            <AmountInput value={amount} onCommit={setAmount} aria-label="Amount" />
          </div>
          <span className={styles.muted}>committed: {amount}</span>
        </Demo>
        <Demo label="Checkbox · IconButton · Tag">
          <Checkbox checked={checked} onChange={setChecked} label="Custom split" />
          <IconButton icon={<X size={14} strokeWidth={1.5} />} label="Remove row" />
          <Tag>Custom</Tag>
          <Tag tone="subtle">Default</Tag>
        </Demo>
        <Demo label="ColorDot + ColorPopover (click the dot)">
          <ColorPopover color={color} onChange={setColor}>
            <ColorDot color={color} title="Change colour" />
          </ColorPopover>
          <code>{color}</code>
        </Demo>
      </Card>
    </Section>
  )
}
