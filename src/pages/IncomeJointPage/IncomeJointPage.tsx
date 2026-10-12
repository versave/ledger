import PageHeader from '../../layout/PageHeader/PageHeader';
import { useEffect, useState } from 'react';
import { incomeService } from '../../services/income.service.ts';
import {
    AmountCell,
    DonutChart,
    type DonutSegment,
    KpiCard,
    Panel,
    Table,
    Td,
    Th,
} from '../../components';
import styles from './IncomeJointPage.module.scss';
import { formatEUR, formatPct } from '../../utils/format.ts';
import { CHART_PALETTE } from '../../styles/palette.ts';
import { IncomeHolderTotals } from '../../../shared/income.shared.ts';

interface Row {
    id: string;
    holderName: string;
    incomeM: number;
    incomeY: number;
    share: number;
}

const calculateSharePercent = (combinedIncome: number, income: number) =>
    (income / combinedIncome) * 100;

export const IncomeJointPage = () => {
    const [incomeHolderTotals, setIncomeHolderTotals] = useState<IncomeHolderTotals[]>([]);
    const [donutChartSegments, setDonutChartSegments] = useState<DonutSegment[]>([]);
    const [rows, setRows] = useState<Row[]>([]);

    useEffect(() => {
        incomeService.getAllHolderTotals().then((holderTotals) => {
            setIncomeHolderTotals(holderTotals);
            setDonutChartSegments(
                holderTotals.map((hT, idx) => ({
                    key: hT.id,
                    label: hT.holder.name,
                    value: hT.amountMonth,
                    color: CHART_PALETTE[idx],
                })),
            );
            setRows(
                holderTotals.map((hT) => ({
                    id: hT.id,
                    holderName: hT.holder.name,
                    incomeM: hT.amountMonth,
                    incomeY: hT.amountYear,
                    share: calculateSharePercent(combinedMonthly, hT.amountMonth),
                })),
            );
        });
    }, []);

    const combinedMonthly = incomeHolderTotals.reduce((sum, income) => sum + income.amountMonth, 0);
    const combinedYearly = incomeHolderTotals.reduce((sum, income) => sum + income.amountYear, 0);

    return (
        <>
            <PageHeader
                title="Income"
                desc="Totals from each person’s income page and the joint total. Edit income sources on each person’s page."
            />

            <div className={styles.content}>
                <div className={styles.cards}>
                    <KpiCard
                        label="Combined income / month"
                        value={formatEUR(combinedMonthly)}
                        sub={`${incomeHolderTotals.length} people · monthly items`}
                    />

                    <KpiCard
                        label="Combined income / month"
                        value={formatEUR(combinedYearly)}
                        sub={`${incomeHolderTotals.length} people · monthly items`}
                    />

                    {incomeHolderTotals.map((incTotals) => (
                        <KpiCard
                            label={`${incTotals.holder.name} / Month`}
                            value={formatEUR(incTotals.amountMonth)}
                            sub={`${formatPct(calculateSharePercent(combinedMonthly, incTotals.amountMonth))} of combined`}
                        />
                    ))}
                </div>

                <Panel kicker="Income by person" title="Monthly">
                    <DonutChart
                        segments={donutChartSegments}
                        centerValue={formatEUR(combinedMonthly)}
                        centerLabel="Combined / month"
                        onColorChange={(key, color) =>
                            setDonutChartSegments((ss) =>
                                ss.map((s) => (s.key === key ? { ...s, color } : s)),
                            )
                        }
                    />
                </Panel>

                <Panel title="Income by person" sub="Derived from each person’s income sources">
                    <Table minWidth={680}>
                        <thead>
                            <tr>
                                <Th>Person</Th>

                                <Th numeric>Income/M</Th>

                                <Th numeric>Income/Y</Th>

                                <Th numeric>Share</Th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((row) => {
                                return (
                                    <tr key={row.id}>
                                        <Td>{row.holderName}</Td>

                                        <Td numeric>
                                            <AmountCell value={row.incomeM} editing={false} />
                                        </Td>

                                        <Td numeric>
                                            <AmountCell value={row.incomeY} editing={false} />
                                        </Td>

                                        <Td numeric>
                                            {formatPct(
                                                calculateSharePercent(combinedMonthly, row.incomeM),
                                            )}
                                        </Td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        <tfoot>
                            <tr>
                                <Td>Joint total</Td>

                                <Td numeric>{formatEUR(combinedMonthly)}</Td>

                                <Td numeric>{formatEUR(combinedYearly)}</Td>

                                <Td numeric>{formatPct(100)}</Td>
                            </tr>
                        </tfoot>
                    </Table>
                </Panel>
            </div>
        </>
    );
};
