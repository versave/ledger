import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
    AmountCell,
    Button,
    Checkbox,
    ColorDot,
    DonutChart,
    type DonutSegment,
    EditToggle,
    IconButton,
    Input,
    KpiCard,
    Label,
    Note,
    Panel,
    Table,
    Tag,
    Td,
    Th,
} from '../../components';
import PageHeader from '../../layout/PageHeader/PageHeader';
import { formatEUR, formatPct } from '../../utils/format';
import { cx } from '../../utils/cx';
import { CHART_PALETTE, REMAINDER_COLOR } from '../../styles/palette';
import {
    incomeShares,
    jointTotal,
    jointTotalRounded,
    sliceActual,
    sliceRounded,
    type JointExpenseCalc,
} from '../../../shared/calc';
import {
    jointExpenseService,
    newTempId,
    type ResolvedJointExpense,
} from '../../services/joint-expense.service';
import { incomeService } from '../../services/income.service';
import { peopleService, type Person } from '../../services/people.service';
import styles from './ExpenseJoint.module.scss';
import { SplitCell } from './SplitCell';
import { TotalsRow } from './TotalsRow';

const PCT_STEP = 5; // income shares round to the nearest 5%
const STEP_CENTS = 1000; // the rounded joint total rounds up to the nearest €10
const NO_REFS = () => NaN; // amounts arrive already resolved, so calc needs no resolver

const valueOf = (e: ResolvedJointExpense): number =>
    typeof e.amount === 'number' ? e.amount : e.amount.value;

export const ExpenseJointPage = () => {
    const [editing, setEditing] = useState(false);
    const [rows, setRows] = useState<ResolvedJointExpense[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [incomeByPerson, setIncomeByPerson] = useState<Record<string, number>>({});
    const [colors, setColors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const synced = useRef<ResolvedJointExpense[]>([]);

    useEffect(() => {
        Promise.all([jointExpenseService.list(), peopleService.list(), incomeService.list()])
            .then(([expenses, ppl, incomes]) => {
                setRows(expenses);
                synced.current = expenses;
                setPeople(ppl);

                const byPerson: Record<string, number> = {};
                for (const p of ppl) {
                    byPerson[p.id] = 0;
                }
                for (const i of incomes) {
                    if (i.holder && i.holder in byPerson) {
                        byPerson[i.holder] += i.amountMonth;
                    }
                }
                setIncomeByPerson(byPerson);
            })
            .catch((e) => setError((e as Error).message));
    }, []);

    const update = (id: string, patch: Partial<ResolvedJointExpense>) =>
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

    const remove = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));

    const addRow = () =>
        setRows((rs) => [...rs, { id: newTempId(), name: '', amount: 0, split: null }]);

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
            const fresh = await jointExpenseService.save(synced.current, rows);
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

    const { actual, rounded } = incomeShares(incomeByPerson, PCT_STEP);

    // The % a person pays of an expense: custom split, else their rounded income share.
    const pctOf = (e: ResolvedJointExpense, personId: string): number =>
        e.split ? (e.split[personId] ?? 0) : (rounded[personId] ?? 0);

    // Switching a row to custom seeds each person with their default rounded share.
    const toggleCustom = (r: ResolvedJointExpense) =>
        update(r.id, {
            split: r.split
                ? null
                : Object.fromEntries(people.map((p) => [p.id, rounded[p.id] ?? 0])),
        });

    // Editing a split %: with exactly two people, the other auto-fills to 100.
    const setSplit = (r: ResolvedJointExpense, personId: string, pct: number) => {
        if (!r.split) {
            return;
        }
        const split = { ...r.split, [personId]: pct };
        if (people.length === 2) {
            const other = people.find((p) => p.id !== personId);
            if (other) {
                split[other.id] = Math.max(0, 100 - pct);
            }
        }
        update(r.id, { split });
    };

    const calcExpenses: JointExpenseCalc[] = rows.map((r) => ({
        amount: valueOf(r),
        split: r.split,
    }));
    const monthlyTotal = jointTotalRounded(calcExpenses, NO_REFS, STEP_CENTS);
    const combinedIncome = Object.values(incomeByPerson).reduce((s, v) => s + v, 0);

    const customCount = rows.filter((r) => r.split).length;
    const badCount = rows.filter(
        (r) => r.split && Math.abs(Object.values(r.split).reduce((s, v) => s + v, 0) - 100) > 0.01,
    ).length;
    const sub =
        `${rows.length} shared ${rows.length === 1 ? 'item' : 'items'}` +
        (customCount ? ` · ${customCount} custom` : '') +
        (badCount ? ` · ${badCount} not 100%` : '');

    // Donut segments are derived from the current rows (one per expense + the rounding buffer).
    const segments: DonutSegment[] = rows.map((r, i) => ({
        key: r.id,
        label: r.name,
        value: valueOf(r),
        color: colors[r.id] ?? CHART_PALETTE[i % CHART_PALETTE.length],
    }));
    const roundingBuffer = monthlyTotal - jointTotal(calcExpenses, NO_REFS);
    if (roundingBuffer > 0) {
        segments.push({
            key: 'rounding-buffer',
            label: 'Rounding buffer',
            value: roundingBuffer,
            color: colors['rounding-buffer'] ?? REMAINDER_COLOR,
        });
    }

    return (
        <>
            <PageHeader
                title="Joint expenses"
                desc="Shared monthly expenses. Each is split by the rounded % from the Joint spread unless it has a custom split."
                actions={<EditToggle editing={editing} onToggle={toggleEdit} />}
            />

            <div className={styles.content}>
                {error && <Note>{error}</Note>}

                <div className={styles.cards}>
                    <KpiCard
                        label="Monthly expenses"
                        value={formatEUR(monthlyTotal)}
                        sub={`Rounded from ${formatEUR(jointTotal(calcExpenses, NO_REFS))}`}
                    />

                    <KpiCard
                        label="Yearly expenses"
                        value={formatEUR(monthlyTotal * 12)}
                        sub="Rounded × 12"
                    />

                    <KpiCard
                        label="Share of income"
                        value={formatPct(
                            combinedIncome ? (monthlyTotal / combinedIncome) * 100 : NaN,
                        )}
                        sub={`of ${formatEUR(combinedIncome)} combined monthly income`}
                    />

                    <KpiCard
                        label="Left after expenses"
                        value={formatEUR(combinedIncome - monthlyTotal)}
                        sub="Combined income minus joint expenses"
                    />
                </div>

                {people.length > 0 && (
                    <div className={styles.whoPays}>
                        <Label>Who pays</Label>

                        <div
                            className={styles.payers}
                            style={{
                                gridTemplateColumns: `repeat(${Math.min(4, people.length)}, minmax(0, 1fr))`,
                            }}
                        >
                            {people.map((person) => {
                                const slice = sliceRounded(
                                    calcExpenses,
                                    person.id,
                                    NO_REFS,
                                    rounded[person.id] ?? 0,
                                    STEP_CENTS,
                                );
                                return (
                                    <KpiCard
                                        key={person.id}
                                        label={`${person.name} pays`}
                                        value={formatEUR(slice)}
                                        pill={formatPct(
                                            monthlyTotal ? (slice / monthlyTotal) * 100 : NaN,
                                        )}
                                        sub="Rounded slice per month · of joint total"
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                <Panel kicker="Where the joint money goes" title="Joint spread">
                    <DonutChart
                        segments={segments}
                        centerValue={formatEUR(monthlyTotal)}
                        centerLabel="Combined / month"
                        onColorChange={(key, color) => setColors((c) => ({ ...c, [key]: color }))}
                    />
                </Panel>

                <Panel
                    title="Monthly expenses"
                    sub={sub}
                    actions={
                        editing && (
                            <Button icon={<Plus size={14} strokeWidth={1.75} />} onClick={addRow}>
                                Add expense
                            </Button>
                        )
                    }
                >
                    <Table fixed minWidth={520 + people.length * 170}>
                        <thead>
                            <tr>
                                <Th>Expense</Th>

                                <Th numeric style={{ width: 170 }}>
                                    Amount
                                </Th>

                                {people.map((p) => (
                                    <Th key={p.id} numeric style={{ width: 150 }}>
                                        {(p.name || 'Person') + ' split'}
                                    </Th>
                                ))}

                                <Th numeric style={{ width: 96 }}>
                                    Split
                                </Th>

                                {/* Reserved so columns don't shift between read/edit mode. */}
                                <Th aria-hidden style={{ width: 52 }} />
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((r, i) => {
                                const amount = r.amount;
                                const isLiteral = typeof amount === 'number';
                                return (
                                    <tr key={r.id}>
                                        <Td>
                                            <div className={styles.nameCell}>
                                                <ColorDot
                                                    color={CHART_PALETTE[i % CHART_PALETTE.length]}
                                                    disabled
                                                />
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
                                                value={isLiteral ? amount : amount.value}
                                                link={
                                                    isLiteral ? undefined : { source: amount.name }
                                                }
                                                editing={editing && isLiteral}
                                                onCommit={(value) =>
                                                    update(r.id, { amount: value })
                                                }
                                            />
                                        </Td>

                                        {people.map((p) => {
                                            const pct = pctOf(r, p.id);
                                            return (
                                                <Td key={p.id} numeric>
                                                    <SplitCell
                                                        editing={editing}
                                                        custom={!!r.split}
                                                        pct={pct}
                                                        share={(valueOf(r) * pct) / 100}
                                                        label={`${p.name || 'Person'} split %`}
                                                        onChange={(next) => setSplit(r, p.id, next)}
                                                    />
                                                </Td>
                                            );
                                        })}

                                        <Td numeric>
                                            {editing ? (
                                                <Checkbox
                                                    checked={!!r.split}
                                                    onChange={() => toggleCustom(r)}
                                                    label="Custom split"
                                                />
                                            ) : r.split ? (
                                                <Tag tone="brass">Custom</Tag>
                                            ) : (
                                                <span className={cx(styles.readText, styles.muted)}>
                                                    Default
                                                </span>
                                            )}
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
                            <TotalsRow
                                label="Total"
                                total={jointTotal(calcExpenses, NO_REFS)}
                                people={people}
                                sliceFor={(pid) =>
                                    sliceActual(calcExpenses, pid, NO_REFS, actual[pid] ?? 0)
                                }
                            />
                            <TotalsRow
                                label="Total rounded"
                                total={monthlyTotal}
                                people={people}
                                sliceFor={(pid) =>
                                    sliceRounded(
                                        calcExpenses,
                                        pid,
                                        NO_REFS,
                                        rounded[pid] ?? 0,
                                        STEP_CENTS,
                                    )
                                }
                            />
                        </tfoot>
                    </Table>
                </Panel>
            </div>
        </>
    );
};
