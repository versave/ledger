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
}

/** Summary card: uppercase label, large tabular value, muted sub-line. */
export default function KpiCard({ label, value, sub, tone = 'default' }: Props) {
    return (
        <Card className={styles.kpi}>
            <Label>{label}</Label>

            <div className={cx(styles.value, tone === 'warn' && styles.warn)}>{value}</div>

            {sub && <div className={styles.sub}>{sub}</div>}
        </Card>
    );
}
