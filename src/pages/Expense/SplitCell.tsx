import { Input } from '../../components';
import { formatEUR } from '../../utils/format';
import { cx } from '../../utils/cx';
import styles from './SplitCell.module.scss';

interface Props {
    editing: boolean;
    custom: boolean;
    pct: number;
    share: number;
    label: string;
    onChange: (pct: number) => void;
}

/** A person's share of one expense: a % input (edit + custom) or a muted "€ · (%)" read cell. */
export function SplitCell({ editing, custom, pct, share, label, onChange }: Props) {
    if (editing && custom) {
        return (
            <div className={styles.splitEdit}>
                <div className={styles.pctWrap}>
                    <Input
                        numeric
                        value={String(pct)}
                        aria-label={label}
                        onChange={(e) => onChange(Number(e.target.value) || 0)}
                    />
                </div>
                <span className={styles.splitSub}>{formatEUR(share)}</span>
            </div>
        );
    }
    return (
        <span className={cx(styles.readText, !custom && styles.muted)}>
            {formatEUR(share)} · ({pct}%)
        </span>
    );
}
