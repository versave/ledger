import { Td } from '../../components';
import { formatEUR } from '../../utils/format';
import type { Person } from '../../services/people.service';

interface Props {
    label: string;
    total: number;
    people: Person[];
    sliceFor: (personId: string) => number;
}

/** A footer totals row: a label, the overall total, and one per-person slice column. */
export function TotalsRow({ label, total, people, sliceFor }: Props) {
    return (
        <tr>
            <Td>{label}</Td>
            <Td numeric>{formatEUR(total)}</Td>
            {people.map((p) => (
                <Td key={p.id} numeric>
                    {formatEUR(sliceFor(p.id))}
                </Td>
            ))}
            <Td />
            <Td aria-hidden />
        </tr>
    );
}
