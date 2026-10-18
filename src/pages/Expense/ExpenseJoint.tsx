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
    Note,
    Panel,
    Table,
    Tag,
    Td,
    Th,
} from '../../components';
import PageHeader from '../../layout/PageHeader/PageHeader';
import { formatEUR } from '../../utils/format';
import { cx } from '../../utils/cx';
import { CHART_PALETTE, REMAINDER_COLOR } from '../../styles/palette';
import {
    incomeShares,
    jointTotal,
    sliceActual,
    sliceRounded,
    type JointExpenseCalc,
    jointTotalRounded,
} from '../../../shared/calc';
import {
    jointExpenseService,
    newTempId,
    type ResolvedJointExpense,
} from '../../services/joint-expense.service';
import { incomeService } from '../../services/income.service';
import { peopleService, type Person } from '../../services/people.service';
import styles from './ExpenseJoint.module.scss';

const PCT_STEP = 5; // income shares round to the nearest 5%
const STEP_CENTS = 1000; // the rounded joint total rounds up to the nearest €10
const NO_REFS = () => NaN; // amounts arrive already resolved, so calc needs no resolver

const valueOf = (e: ResolvedJointExpense): number =>
    typeof e.amount === 'number' ? e.amount : e.amount.value;

export const ExpenseJointPage = () => {
    const [editing, setEditing] = useState(false);
    const [rows, setRows] = useState<ResolvedJointExpense[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [donutChartSegments, setDonutChartSegments] = useState<DonutSegment[]>([]);
    const [incomeByPerson, setIncomeByPerson] = useState<Record<string, number>>({});
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

                const expensesDonutSegments = expenses.map((exp, idx) => {
                    const amount = exp.amount;
                    const isLiteral = typeof amount === 'number';

                    return {
                        key: exp.id,
                        label: exp.name,
                        value: isLiteral ? amount : amount.value,
                        color: CHART_PALETTE[idx],
                    };
                });
                // todo: Fix adding this to chart - sometimes does not appear or chart does not update
                const roundingBuffer =
                    jointTotalRoundedExpenses - jointTotal(calcExpenses, NO_REFS);

                if (roundingBuffer > 0) {
                    expensesDonutSegments.push({
                        key: 'expenses-rounding-buffer',
                        label: 'Rounding buffer',
                        value: roundingBuffer,
                        color: REMAINDER_COLOR,
                    });
                }

                setDonutChartSegments(expensesDonutSegments);

                setIncomeByPerson(byPerson);
            })
            .catch((e) => setError((e as Error).message));
    }, []);

    const update = (id: string, patch: Partial<ResolvedJointExpense>) => {
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    };

    const remove = (id: string) => {
        setRows((rs) => rs.filter((r) => r.id !== id));
    };

    const addRow = () => {
        setRows((rs) => [...rs, { id: newTempId(), name: '', amount: 0, split: null }]);
    };

    const { actual, rounded } = incomeShares(incomeByPerson, PCT_STEP);

    // The % a person pays of an expense: custom split, else their rounded income share.
    const pctOf = (e: ResolvedJointExpense, personId: string): number =>
        e.split ? (e.split[personId] ?? 0) : (rounded[personId] ?? 0);

    // Switching a row to custom seeds each person with their default rounded share.
    const toggleCustom = (id: string) => {
        setRows((rs) =>
            rs.map((r) => {
                if (r.id !== id) {
                    return r;
                }
                if (r.split) {
                    return { ...r, split: null };
                }
                const split: Record<string, number> = {};
                for (const p of people) {
                    split[p.id] = rounded[p.id] ?? 0;
                }
                return { ...r, split };
            }),
        );
    };

    // Editing a split %: with exactly two people, the other auto-fills to 100.
    const setSplit = (id: string, personId: string, pct: number) => {
        setRows((rs) =>
            rs.map((r) => {
                if (r.id !== id || !r.split) {
                    return r;
                }
                const split = { ...r.split, [personId]: pct };
                if (people.length === 2) {
                    const other = people.find((p) => p.id !== personId);
                    if (other) {
                        split[other.id] = Math.max(0, 100 - pct);
                    }
                }
                return { ...r, split };
            }),
        );
    };

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

    const calcExpenses: JointExpenseCalc[] = rows.map((r) => ({
        amount: valueOf(r),
        split: r.split,
    }));
    const customCount = rows.filter((r) => r.split).length;
    const badCount = rows.filter(
        (r) => r.split && Math.abs(Object.values(r.split).reduce((s, v) => s + v, 0) - 100) > 0.01,
    ).length;
    const sub =
        `${rows.length} shared ${rows.length === 1 ? 'item' : 'items'}` +
        (customCount ? ` · ${customCount} custom` : '') +
        (badCount ? ` · ${badCount} not 100%` : '');
    const jointTotalRoundedExpenses = jointTotalRounded(calcExpenses, NO_REFS, STEP_CENTS);

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
                        value={formatEUR(jointTotalRoundedExpenses)}
                        sub={`${rows.length} items`}
                    />

                    <KpiCard
                        label="Yearly expenses"
                        value={formatEUR(jointTotalRoundedExpenses * 12)}
                        sub="Monthly × 12"
                    />

                    {people.map((person) => (
                        <KpiCard
                            label={`${person.name} pays`}
                            value={formatEUR(
                                sliceRounded(
                                    calcExpenses,
                                    person.id,
                                    NO_REFS,
                                    rounded[person.id] ?? 0,
                                    STEP_CENTS,
                                ),
                            )}
                            sub="Rounded slice per month"
                        />
                    ))}
                </div>

                <Panel kicker="Where the joint money goes" title="Joint spread">
                    <DonutChart
                        segments={donutChartSegments}
                        centerValue={formatEUR(jointTotalRoundedExpenses)}
                        centerLabel="Combined / month"
                        onColorChange={(key, color) =>
                            setDonutChartSegments((ss) =>
                                ss.map((s) => (s.key === key ? { ...s, color } : s)),
                            )
                        }
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
                                            const share = (valueOf(r) * pct) / 100;
                                            return (
                                                <Td key={p.id} numeric>
                                                    {editing && r.split ? (
                                                        <div className={styles.splitEdit}>
                                                            <div className={styles.pctWrap}>
                                                                <Input
                                                                    numeric
                                                                    value={String(pct)}
                                                                    aria-label={`${p.name || 'Person'} split %`}
                                                                    onChange={(e) =>
                                                                        setSplit(
                                                                            r.id,
                                                                            p.id,
                                                                            Number(
                                                                                e.target.value,
                                                                            ) || 0,
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <span className={styles.splitSub}>
                                                                {formatEUR(share)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span
                                                            className={cx(
                                                                styles.readText,
                                                                !r.split && styles.muted,
                                                            )}
                                                        >
                                                            {formatEUR(share)} · ({pct}%)
                                                        </span>
                                                    )}
                                                </Td>
                                            );
                                        })}

                                        <Td numeric>
                                            {editing ? (
                                                <Checkbox
                                                    checked={!!r.split}
                                                    onChange={() => toggleCustom(r.id)}
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
                            <tr>
                                <Td>Total</Td>

                                <Td numeric>{formatEUR(jointTotal(calcExpenses, NO_REFS))}</Td>

                                {people.map((p) => (
                                    <Td key={p.id} numeric>
                                        {formatEUR(
                                            sliceActual(
                                                calcExpenses,
                                                p.id,
                                                NO_REFS,
                                                actual[p.id] ?? 0,
                                            ),
                                        )}
                                    </Td>
                                ))}

                                <Td />

                                <Td aria-hidden />
                            </tr>

                            <tr>
                                <Td>Total rounded</Td>

                                <Td numeric>{formatEUR(jointTotalRoundedExpenses)}</Td>

                                {people.map((p) => (
                                    <Td key={p.id} numeric>
                                        {formatEUR(
                                            sliceRounded(
                                                calcExpenses,
                                                p.id,
                                                NO_REFS,
                                                rounded[p.id] ?? 0,
                                                STEP_CENTS,
                                            ),
                                        )}
                                    </Td>
                                ))}

                                <Td />

                                <Td aria-hidden />
                            </tr>
                        </tfoot>
                    </Table>
                </Panel>
            </div>
        </>
    );
};
