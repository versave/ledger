import { useEffect, useRef, useState } from 'react';
import { incomeService } from '../../services/income.service.ts';
import { ResolvedExpense, type ResolvedJointExpense } from '../../../shared/expense.ts';
import { ExpenseService } from '../../services/expense.service.ts';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer.tsx';
import PageHeader from '../../layout/PageHeader/PageHeader.tsx';
import { EditToggle } from '../../components';
import { newTempId } from '../../services/joint-expense.service.ts';
import { sum } from '../../../shared/calc.ts';

const valueOf = (e: ResolvedExpense): number =>
    typeof e.amount === 'number' ? e.amount : e.amount.value;

export const ExpensePersonalPage = () => {
    const [rows, setRows] = useState<ResolvedExpense[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const synced = useRef<ResolvedExpense[]>([]);

    useEffect(() => {
        Promise.all([ExpenseService.list(), incomeService.list()])
            .then(([expenses, incomes]) => {
                setRows(expenses);
                synced.current = expenses;
            })
            .catch((e) => setError((e as Error).message));
    }, []);

    const calcExpenses: number[] = rows.map((exp) => valueOf(exp));
    const monthlyTotal = sum(calcExpenses);

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

    return (
        <>
            <PageHeader
                title="Personal expenses"
                desc="Recurring monthly expenses. The total feeds the Personal spread; any amount can link to a joint slice, a loan payment or another value."
                actions={<EditToggle editing={editing} onToggle={toggleEdit} />}
            />

            <ContentContainer></ContentContainer>
        </>
    );
};
