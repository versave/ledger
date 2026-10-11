import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import {
    AmountCell,
    Button,
    Checkbox,
    ColorDot,
    ColorPopover,
    EditToggle,
    IconButton,
    Input,
    LinkPicker,
    Panel,
    PercentBar,
    Table,
    Tag,
    Td,
    Th,
} from '../../../components'
import { CHART_PALETTE } from '../../../styles/palette'
import { formatEUR, formatPct } from '../../../utils/format'
import Section from '../Section'
import { SAMPLE_LINK_OPTIONS } from '../styleguide.data'
import styles from '../Styleguide.module.scss'

type Amount = number | { ref: string }

interface Row {
    id: string
    name: string
    amount: Amount
    color: string
    custom: boolean
}

const INCOME = 425000

const initialRows: Row[] = [
    { id: 'rent', name: 'Rent', amount: 120000, color: CHART_PALETTE[0], custom: false },
    {
        id: 'joint',
        name: 'Joint expenses slice',
        amount: { ref: 'joint.totalRounded' },
        color: CHART_PALETTE[1],
        custom: true,
    },
    { id: 'phone', name: 'Phone', amount: 15000, color: CHART_PALETTE[2], custom: false },
]

const optionFor = (key: string) => SAMPLE_LINK_OPTIONS.find((o) => o.key === key)
const resolve = (a: Amount) => (typeof a === 'number' ? a : (optionFor(a.ref)?.value ?? NaN))

export default function Tables() {
    const [editing, setEditing] = useState(true)
    const [rows, setRows] = useState(initialRows)
    const [pickerFor, setPickerFor] = useState<string | null>(null)

    const update = (id: string, patch: Partial<Row>) =>
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))

    const picking = rows.find((r) => r.id === pickerFor)
    const total = rows.reduce((sum, r) => sum + (resolve(r.amount) || 0), 0)

    return (
        <Section title="Panel + table (editable, with linking)">
            <Panel
                kicker="Personal spread"
                title="Recurring monthly expenses"
                sub={`${rows.length} items · toggle edit mode, click a link icon to open the LinkPicker`}
                actions={
                    <>
                        <EditToggle editing={editing} onToggle={() => setEditing(!editing)} />
                        {editing && (
                            <Button
                                icon={<Plus size={14} strokeWidth={1.75} />}
                                onClick={() =>
                                    setRows((rs) => [
                                        ...rs,
                                        {
                                            id: crypto.randomUUID(),
                                            name: '',
                                            amount: 0,
                                            color: CHART_PALETTE[rs.length % 10],
                                            custom: false,
                                        },
                                    ])
                                }
                            >
                                Add expense
                            </Button>
                        )}
                    </>
                }
            >
                <Table minWidth={680}>
                    <thead>
                        <tr>
                            <Th>Expense</Th>
                            <Th numeric>Amount</Th>
                            <Th numeric>% of income</Th>
                            <Th>Split</Th>
                            {editing && <Th />}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => {
                            const value = resolve(r.amount)
                            const link = typeof r.amount === 'number' ? undefined : r.amount
                            return (
                                <tr key={r.id}>
                                    <Td>
                                        <div className={styles.nameCell}>
                                            <ColorPopover
                                                color={r.color}
                                                onChange={(color) => update(r.id, { color })}
                                            >
                                                <ColorDot color={r.color} title="Change colour" />
                                            </ColorPopover>
                                            {editing ? (
                                                <Input
                                                    value={r.name}
                                                    placeholder="Name"
                                                    onChange={(e) =>
                                                        update(r.id, { name: e.target.value })
                                                    }
                                                />
                                            ) : (
                                                <span className={styles.readText}>{r.name}</span>
                                            )}
                                        </div>
                                    </Td>
                                    <Td numeric>
                                        <AmountCell
                                            value={value}
                                            link={
                                                link && {
                                                    source: `${optionFor(link.ref)?.group} · ${optionFor(link.ref)?.label}`,
                                                }
                                            }
                                            editing={editing}
                                            onCommit={(amount) => update(r.id, { amount })}
                                            onLinkClick={() => setPickerFor(r.id)}
                                        />
                                    </Td>
                                    <Td numeric>
                                        <PercentBar
                                            value={(value / INCOME) * 100}
                                            color={r.color}
                                        />
                                    </Td>
                                    <Td>
                                        {editing ? (
                                            <Checkbox
                                                checked={r.custom}
                                                onChange={(custom) => update(r.id, { custom })}
                                                label="Custom split"
                                            />
                                        ) : (
                                            <Tag tone={r.custom ? 'brass' : 'subtle'}>
                                                {r.custom ? 'Custom' : 'Default'}
                                            </Tag>
                                        )}
                                    </Td>
                                    {editing && (
                                        <Td>
                                            <IconButton
                                                icon={<X size={14} strokeWidth={1.5} />}
                                                label="Remove row"
                                                onClick={() =>
                                                    setRows((rs) => rs.filter((x) => x.id !== r.id))
                                                }
                                            />
                                        </Td>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <Td>Total monthly expenses</Td>
                            <Td numeric>{formatEUR(total)}</Td>
                            <Td numeric>{formatPct((total / INCOME) * 100)}</Td>
                            <Td />
                            {editing && <Td />}
                        </tr>
                    </tfoot>
                </Table>
            </Panel>

            <LinkPicker
                open={!!picking}
                onOpenChange={(open) => !open && setPickerFor(null)}
                options={SAMPLE_LINK_OPTIONS}
                currentKey={
                    picking && typeof picking.amount !== 'number' ? picking.amount.ref : undefined
                }
                onPick={(ref) => picking && update(picking.id, { amount: { ref } })}
                onUnlink={() => picking && update(picking.id, { amount: resolve(picking.amount) })}
            />
        </Section>
    )
}
