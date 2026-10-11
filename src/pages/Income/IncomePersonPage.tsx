import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { peopleService, type Person } from '../../services/people.service';
import { IncomeTable } from './IncomeTable';

export const IncomePersonPage = () => {
    const { personId = '' } = useParams();
    const [person, setPerson] = useState<Person | null>(null);

    useEffect(() => {
        peopleService
            .list()
            .then((people) => setPerson(people.find((p) => p.id === personId) ?? null))
            .catch(() => setPerson(null));
    }, [personId]);

    return (
        <IncomeTable
            key={personId}
            holder={personId}
            title={person ? `${person.name || 'Unnamed'} · Income` : 'Income'}
            desc="Enter either the monthly or the yearly amount; the other is calculated."
        />
    );
};
