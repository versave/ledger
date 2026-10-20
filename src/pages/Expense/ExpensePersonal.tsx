import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
    AmountCell,
    Button,
    ColorDot,
    DonutChart,
    type DonutSegment,
    EditToggle,
    IconButton,
    Input,
    KpiCard,
    Note,
    Panel,
    Table,
    Td,
    Th,
} from '../../components';
import PageHeader from '../../layout/PageHeader/PageHeader';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import { incomeService } from '../../services/income.service';
import { peopleService } from '../../services/people.service';
import { ExpenseService, newTempId, type ResolvedExpense } from '../../services/expense.service';
import { sum } from '../../../shared/calc';
import { formatEUR, formatPct } from '../../utils/format';
import { CHART_PALETTE } from '../../styles/palette';
import styles from './ExpensePersonal.module.scss';

const valueOf = (e: ResolvedExpense): number =>
    typeof e.amount === 'number' ? e.amount : e.amount.value;

export const ExpensePersonalPage = () => {
    const [rows, setRows] = useState<ResolvedExpense[]>([]);
    const [income, setIncome] = useState(0);
    const [colors, setColors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const synced = useRef<ResolvedExpense[]>([]);

    useEffect(() => {
        Promise.all([ExpenseService.list(), incomeService.list(), peopleService.list()])
            .then(([expenses, incomes, people]) => {
                setRows(expenses);
                synced.current = expenses;

                // "Personal" income is the primary person's (people[0], as /income redirects to).
                const primary = people[0]?.id;
                setIncome(
                    sum(incomes.filter((i) => i.holder === primary).map((i) => i.amountMonth)),
                );
            })
            .catch((e) => setError((e as Error).message));
    }, []);

    const update = (id: string, patch: Partial<ResolvedExpense>) =>
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

    const remove = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));

    const addRow = () => setRows((rs) => [...rs, { id: newTempId(), name: '', amount: 0 }]);

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
            const fresh = await ExpenseService.save(synced.current, rows);
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

    const monthlyTotal = sum(rows.map(valueOf));
    const share = (value: number): number => (income ? (value / income) * 100 : NaN);

    // One slice per expense, coloured from the palette (recolours override by row id).
    const colorFor = (r: ResolvedExpense, i: number): string =>
        colors[r.id] ?? CHART_PALETTE[i % CHART_PALETTE.length];

    const segments: DonutSegment[] = rows.map((r, i) => ({
        key: r.id,
        label: r.name,
        value: valueOf(r),
        color: colorFor(r, i),
    }));

    return (
        <>
            <PageHeader
                title="Personal expenses"
                desc="Recurring monthly expenses. The total feeds the Personal spread; any amount can link to a joint slice, a loan payment or another value."
                actions={<EditToggle editing={editing} onToggle={toggleEdit} />}
            />

            <ContentContainer>
                {error && <Note>{error}</Note>}

                <div className={styles.cards}>
                    <KpiCard
                        label="Monthly expenses"
                        value={formatEUR(monthlyTotal)}
                        sub={`${rows.length} ${rows.length === 1 ? 'item' : 'items'}`}
                    />

                    <KpiCard
                        label="Yearly expenses"
                        value={formatEUR(monthlyTotal * 12)}
                        sub="Monthly × 12"
                    />

                    <KpiCard
                        label="Share of income"
                        value={formatPct(share(monthlyTotal))}
                        sub={`of ${formatEUR(income)} monthly income`}
                    />

                    <KpiCard
                        label="Left after expenses"
                        value={formatEUR(income - monthlyTotal)}
                        sub="Goes to buckets"
                    />
                </div>

                <Panel kicker="Where your money goes" title="Personal expenses">
                    <DonutChart
                        segments={segments}
                        centerValue={formatEUR(monthlyTotal)}
                        centerLabel="Per month"
                        onColorChange={(key, color) => setColors((c) => ({ ...c, [key]: color }))}
                    />
                </Panel>

                <Panel
                    title="Recurring monthly expenses"
                    sub={`${rows.length} ${rows.length === 1 ? 'item' : 'items'}`}
                    actions={
                        editing && (
                            <Button icon={<Plus size={14} strokeWidth={1.75} />} onClick={addRow}>
                                Add expense
                            </Button>
                        )
                    }
                >
                    <Table fixed minWidth={460}>
                        <thead>
                            <tr>
                                <Th>Expense</Th>

                                <Th numeric style={{ width: 170 }}>
                                    Amount
                                </Th>

                                <Th numeric style={{ width: 124 }}>
                                    Percentage %
                                </Th>

                                {/* Reserved so columns don't shift between read/edit mode. */}
                                <Th aria-hidden style={{ width: 52 }} />
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((r, i) => {
                                const amount = r.amount;
                                const isLiteral = typeof amount === 'number';
                                const value = isLiteral ? amount : amount.value;
                                return (
                                    <tr key={r.id}>
                                        <Td>
                                            <div className={styles.nameCell}>
                                                <ColorDot color={colorFor(r, i)} disabled />
                                                {editing ? (
                                                    <Input
                                                        value={r.name}
                                                        placeholder="Name"
                                                        aria-label="Expense name"
                                                        onChange={(e) =>
                                                            update(r.id, { name: e.target.value })
                                                        }
                                                    />
                                                ) : (
                                                    <span className={styles.readText}>
                                                        {r.name}
                                                    </span>
                                                )}
                                            </div>
                                        </Td>

                                        <Td numeric>
                                            <AmountCell
                                                value={value}
                                                link={
                                                    isLiteral ? undefined : { source: amount.name }
                                                }
                                                editing={editing && isLiteral}
                                                onCommit={(next) => update(r.id, { amount: next })}
                                            />
                                        </Td>

                                        <Td numeric>
                                            <span className={styles.muted}>
                                                {formatPct(share(value))}
                                            </span>
                                        </Td>

                                        <Td>
                                            {editing && (
                                                <IconButton
                                                    icon={<X size={14} strokeWidth={1.5} />}
                                                    label="Remove row"
                                                    onClick={() => remove(r.id)}
                                                />
                                            )}
                                        </Td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        <tfoot>
                            <tr>
                                <Td>Total monthly expenses</Td>
                                <Td numeric>{formatEUR(monthlyTotal)}</Td>
                                <Td numeric>
                                    <span className={styles.muted}>
                                        {formatPct(share(monthlyTotal))}
                                    </span>
                                </Td>
                                <Td aria-hidden />
                            </tr>

                            <tr>
                                <Td>Post monthly expenses leftover</Td>
                                <Td numeric>{formatEUR(income - monthlyTotal)}</Td>
                                <Td />
                                <Td aria-hidden />
                            </tr>
                        </tfoot>
                    </Table>
                </Panel>
            </ContentContainer>
        </>
    );
};
