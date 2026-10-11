import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import {
    AmountCell,
    Button,
    EditToggle,
    IconButton,
    Input,
    Panel,
    Select,
    Table,
    Td,
    Th,
} from '../../components'
import PageHeader from '../../layout/PageHeader/PageHeader'
import { formatEUR } from '../../utils/format'
import { FREQUENCIES, type Frequency } from '../../../shared/enums'
import styles from './Income.module.scss'

// UI labels for the DB-backed frequency values ('Month' | 'Year').
const FREQUENCY_LABELS: Record<Frequency, string> = { Month: 'Monthly', Year: 'Yearly' }
const FREQUENCY_OPTIONS = FREQUENCIES.map((f) => ({ value: f, label: FREQUENCY_LABELS[f] }))

interface IncomeRow {
    id: string
    name: string
    amount: number
    frequency: Frequency
    usage: string
}

const INITIAL_ROWS: IncomeRow[] = [
    { id: 'salary', name: 'Salary', amount: 297800, frequency: 'Month', usage: 'Monthly fuel' },
    {
        id: 'side',
        name: 'Side projects',
        amount: 45000,
        frequency: 'Month',
        usage: 'Lifestyle bucket',
    },
    {
        id: 'rent',
        name: 'Rental income',
        amount: 796800,
        frequency: 'Year',
        usage: 'Property fund',
    },
]

// `amount` is stored in the frequency's unit; the other column is derived for display.
const monthlyOf = (r: IncomeRow) => (r.frequency === 'Month' ? r.amount : Math.round(r.amount / 12))
const yearlyOf = (r: IncomeRow) => (r.frequency === 'Year' ? r.amount : r.amount * 12)

export const Income = () => {
    const [editing, setEditing] = useState(false)
    const [rows, setRows] = useState<IncomeRow[]>(INITIAL_ROWS)

    const update = (id: string, patch: Partial<IncomeRow>) => {
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    }

    const remove = (id: string) => {
        setRows((rs) => rs.filter((r) => r.id !== id))
    }

    // Switching frequency keeps the real money the same by converting the stored unit.
    const changeFrequency = (r: IncomeRow, next: Frequency) => {
        if (next === r.frequency) {
            return
        }

        const amount = next === 'Year' ? r.amount * 12 : Math.round(r.amount / 12)

        update(r.id, { frequency: next, amount })
    }

    const addRow = () => {
        setRows((rs) => [
            ...rs,
            { id: crypto.randomUUID(), name: '', amount: 0, frequency: 'Month', usage: '' },
        ])
    }

    // Total/M counts Monthly rows only (their amount is already monthly); Total/Y sums every row.
    const totalM = rows.filter((r) => r.frequency === 'Month').reduce((sum, r) => sum + r.amount, 0)
    const totalY = rows.reduce((sum, r) => sum + yearlyOf(r), 0)

    return (
        <>
            <PageHeader
                title="Income"
                desc="Enter the amount for each source's frequency; the other column is calculated. The monthly total counts monthly items only."
                actions={<EditToggle editing={editing} onToggle={() => setEditing(!editing)} />}
            />

            <Panel
                title="Income sources"
                sub={`${rows.length} ${rows.length === 1 ? 'source' : 'sources'}`}
                actions={
                    editing && (
                        <Button icon={<Plus size={14} strokeWidth={1.75} />} onClick={addRow}>
                            Add income source
                        </Button>
                    )
                }
            >
                <Table minWidth={720}>
                    <thead>
                        <tr>
                            <Th>Source</Th>

                            <Th numeric>Amount/M</Th>

                            <Th numeric>Amount/Y</Th>

                            <Th>Frequency</Th>

                            <Th>Usage</Th>

                            {editing && <Th />}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <Td>
                                    {editing ? (
                                        <Input
                                            value={r.name}
                                            placeholder="Name"
                                            aria-label="Source name"
                                            onChange={(e) => update(r.id, { name: e.target.value })}
                                        />
                                    ) : (
                                        <span className={styles.readText}>{r.name}</span>
                                    )}
                                </Td>

                                <Td
                                    numeric
                                    className={r.frequency !== 'Month' ? styles.derived : undefined}
                                >
                                    <AmountCell
                                        value={monthlyOf(r)}
                                        editing={editing && r.frequency === 'Month'}
                                        onCommit={(amount) => update(r.id, { amount })}
                                    />
                                </Td>

                                <Td
                                    numeric
                                    className={r.frequency !== 'Year' ? styles.derived : undefined}
                                >
                                    <AmountCell
                                        value={yearlyOf(r)}
                                        editing={editing && r.frequency === 'Year'}
                                        onCommit={(amount) => update(r.id, { amount })}
                                    />
                                </Td>

                                <Td>
                                    {editing ? (
                                        <Select
                                            value={r.frequency}
                                            options={FREQUENCY_OPTIONS}
                                            aria-label="Frequency"
                                            onChange={(e) =>
                                                changeFrequency(r, e.target.value as Frequency)
                                            }
                                        />
                                    ) : (
                                        <span className={styles.readText}>
                                            {FREQUENCY_LABELS[r.frequency]}
                                        </span>
                                    )}
                                </Td>

                                <Td>
                                    {editing ? (
                                        <Input
                                            variant="subtle"
                                            value={r.usage}
                                            placeholder="Usage"
                                            aria-label="Usage"
                                            onChange={(e) =>
                                                update(r.id, { usage: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <span className={styles.readText}>{r.usage}</span>
                                    )}
                                </Td>

                                {editing && (
                                    <Td>
                                        <IconButton
                                            icon={<X size={14} strokeWidth={1.5} />}
                                            label="Remove row"
                                            onClick={() => remove(r.id)}
                                        />
                                    </Td>
                                )}
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr>
                            <Td>Total</Td>

                            <Td numeric>{formatEUR(totalM)}</Td>

                            <Td numeric>{formatEUR(totalY)}</Td>

                            <Td />

                            <Td />

                            {editing && <Td />}
                        </tr>
                    </tfoot>
                </Table>
            </Panel>
        </>
    )
}
