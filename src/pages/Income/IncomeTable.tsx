import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
    AmountCell,
    Button,
    EditToggle,
    IconButton,
    Input,
    Note,
    Panel,
    Select,
    Table,
    Td,
    Th,
} from '../../components';
import PageHeader from '../../layout/PageHeader/PageHeader';
import { formatEUR } from '../../utils/format';
import { FREQUENCIES, type Frequency } from '../../../shared/enums';
import { incomeService, newTempId, type Income as IncomeRow } from '../../services/income.service';
import { cx } from '../../utils/cx';
import styles from './Income.module.scss';

const FREQUENCY_LABELS: Record<Frequency, string> = { Month: 'Monthly', Year: 'Yearly' };
const FREQUENCY_OPTIONS = FREQUENCIES.map((f) => ({ value: f, label: FREQUENCY_LABELS[f] }));

const yearlyOf = (r: IncomeRow) => r.amountMonth * 12;

interface Props {
    title: string;
    desc: string;
    /** When set, the table shows (and creates) only this person's income. */
    holder?: string;
}

// todo: Don't request income data here - it must be passed down to this component
export const IncomeTable = ({ title, desc, holder }: Props) => {
    const [editing, setEditing] = useState(false);
    const [rows, setRows] = useState<IncomeRow[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const synced = useRef<IncomeRow[]>([]);

    useEffect(() => {
        const load = holder ? incomeService.listByHolder(holder) : incomeService.list();

        load.then((data) => {
            setRows(data);
            synced.current = data;
        }).catch((e) => setError((e as Error).message));
    }, [holder]);

    const update = (id: string, patch: Partial<IncomeRow>) => {
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    };

    const remove = (id: string) => {
        setRows((rs) => rs.filter((r) => r.id !== id));
    };

    const addRow = () => {
        setRows((rs) => [
            ...rs,
            {
                id: newTempId(),
                name: '',
                amountMonth: 0,
                currency: 'EUR',
                frequency: 'Month',
                usage: '',
                holder: holder ?? null,
            },
        ]);
    };

    // Edit locally for real-time calcs; on leaving edit mode, persist and resync.
    const toggleEdit = async () => {
        if (!editing) {
            setEditing(true);
            return;
        }
        if (saving) {
            return;
        }
        setSaving(true);
        try {
            const fresh = holder
                ? await incomeService.saveForHolder(holder, synced.current, rows)
                : await incomeService.save(synced.current, rows);
            setRows(fresh);
            synced.current = fresh;
            setError(null);
            setEditing(false);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    };

    const totalM = rows.reduce((sum, r) => sum + r.amountMonth, 0);
    const totalY = rows.reduce((sum, r) => sum + yearlyOf(r), 0);

    return (
        <>
            <PageHeader
                title={title}
                desc={desc}
                actions={<EditToggle editing={editing} onToggle={toggleEdit} />}
            />

            {error && <Note>{error}</Note>}

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

                                <Td numeric>
                                    <AmountCell
                                        value={r.amountMonth}
                                        editing={editing}
                                        onCommit={(amountMonth) => update(r.id, { amountMonth })}
                                    />
                                </Td>

                                <Td numeric>
                                    <AmountCell
                                        value={yearlyOf(r)}
                                        editing={editing}
                                        onCommit={(yearly) =>
                                            update(r.id, { amountMonth: Math.round(yearly / 12) })
                                        }
                                    />
                                </Td>

                                <Td>
                                    {editing ? (
                                        <Select
                                            value={r.frequency}
                                            options={FREQUENCY_OPTIONS}
                                            aria-label="Frequency"
                                            onChange={(e) =>
                                                update(r.id, {
                                                    frequency: e.target.value as Frequency,
                                                })
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
                                        <span className={cx(styles.readText, styles.derived)}>
                                            {r.usage}
                                        </span>
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
    );
};
