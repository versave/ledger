import { useRef, useState, type KeyboardEvent } from 'react';
import { formatEUR, formatRaw, parseAmount } from '../../utils/format';
import Input from '../Input/Input';

interface Props {
    value: number;
    onCommit: (value: number) => void;
    /** `cell` for tables, `kpi` for the editable KPI value (NWR monthly income). */
    variant?: 'cell' | 'kpi';
    placeholder?: string;
    className?: string;
    'aria-label'?: string;
}

/**
 * Shows `€2 978,00`; on focus switches to raw `2978,00`. Commits on blur or Enter,
 * Esc reverts. Parsing accepts `1.234,56`, `1234.56`, `€ 1 234`.
 */
export default function AmountInput({ value, onCommit, variant = 'cell', ...rest }: Props) {
    const [draft, setDraft] = useState<string | null>(null);
    const cancelled = useRef(false);

    const commit = () => {
        if (!cancelled.current && draft !== null && draft !== formatRaw(value)) {
            onCommit(parseAmount(draft));
        }
        cancelled.current = false;
        setDraft(null);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
        if (e.key === 'Escape') {
            cancelled.current = true;
            e.currentTarget.blur();
        }
    };

    return (
        <Input
            variant={variant}
            numeric
            value={draft ?? formatEUR(value)}
            onFocus={(e) => {
                setDraft(formatRaw(value));
                e.currentTarget.select();
            }}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={onKeyDown}
            {...rest}
        />
    );
}
