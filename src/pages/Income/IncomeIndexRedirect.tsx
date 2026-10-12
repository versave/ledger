import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { peopleService } from '../../services/people.service';

/** /income has no page of its own — redirect to the first person's income page. */
export const IncomeIndexRedirect = () => {
    const [target, setTarget] = useState<string | null>(null);

    useEffect(() => {
        peopleService
            .list()
            .then((people) => setTarget(people.length ? `/income/${people[0].id}` : '/people'))
            .catch(() => setTarget('/people'));
    }, []);

    return target ? <Navigate to={target} replace /> : null;
};
