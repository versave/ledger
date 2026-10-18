import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import styles from './Table.module.scss'

interface TableProps {
    /** Below this width the table scrolls horizontally inside its card. */
    minWidth?: number | string
    /** Fixed layout: columns keep their width (set via <Th> widths) instead of resizing to content. */
    fixed?: boolean
    children: ReactNode
}

/** Use with native thead/tbody/tfoot; header band, row hover and footer totals are styled here. */
export const Table = ({ minWidth, fixed, children }: TableProps) => {
    return (
        <div className={styles.wrap}>
            <table className={cx(styles.table, fixed && styles.fixed)} style={{ minWidth }}>
                {children}
            </table>
        </div>
    )
}

interface CellProps {
    /** Right-aligned tabular figures. */
    numeric?: boolean
    muted?: boolean
}

export function Th({
    numeric,
    className,
    ...rest
}: CellProps & ThHTMLAttributes<HTMLTableCellElement>) {
    return <th className={cx(numeric && styles.numeric, className)} {...rest} />
}

export function Td({
    numeric,
    muted,
    className,
    ...rest
}: CellProps & TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td className={cx(numeric && styles.numeric, muted && styles.muted, className)} {...rest} />
    )
}
