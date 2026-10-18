import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import Card from '../Card/Card';
import Label from '../Label/Label';
import styles from './KpiCard.module.scss';

interface Props {
    label: string;
    value: ReactNode;
    sub?: ReactNode;
    tone?: 'default' | 'warn';
    /** Optional badge shown to the right of the value (e.g. a percentage). */
    pill?: ReactNode;
}

/** Summary card: uppercase label, large tabular value, muted sub-line, optional pill. */
export default function KpiCard({ label, value, sub, tone = 'default', pill }: Props) {
    return (
        <Card className={styles.kpi}>
            <Label>{label}</Label>

            <div className={styles.valueRow}>
                <div className={cx(styles.value, tone === 'warn' && styles.warn)}>{value}</div>
                {pill != null && <span className={styles.pill}>{pill}</span>}
            </div>

            {sub && <div className={styles.sub}>{sub}</div>}
        </Card>
    );
}
