import { useEffect, useState } from 'react';
import { peopleService, Person } from '../../services/people.service.ts';
import { NavLink } from 'react-router-dom';
import { cx } from '../../utils/cx.ts';
import styles from '../Sidebar/Sidebar.module.scss';
import incomePageNavLinkStyles from './IncomePagesNavLinks.module.scss';
import { Wallet } from 'lucide-react';

const IncomeRoute = () => {
    return (
        <NavLink
            to="/income"
            className={({ isActive }) => cx(styles.navItem, isActive && styles.active)}
        >
            <Wallet size={18} strokeWidth={1.5} />

            <span>Income</span>
        </NavLink>
    );
};

export const IncomePagesNavLinks = () => {
    const [people, setPeople] = useState<Person[]>([]);

    useEffect(() => {
        peopleService.list().then((data) => {
            setPeople(data);
        });
    }, []);

    return people.length > 1 ? (
        <>
            <IncomeRoute />

            {people.map((person) => (
                <NavLink
                    key={person.id}
                    to={`/income/${person.id}`}
                    className={({ isActive }) =>
                        cx(
                            incomePageNavLinkStyles.subLink,
                            isActive && incomePageNavLinkStyles.active,
                        )
                    }
                >
                    <span>{person.name}</span>
                </NavLink>
            ))}
        </>
    ) : (
        <IncomeRoute />
    );
};
