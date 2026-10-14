import { useEffect, useState } from 'react';
import { peopleService, Person } from '../../services/people.service.ts';
import { NavLink } from 'react-router-dom';
import { cx } from '../../utils/cx.ts';
import styles from '../Sidebar/Sidebar.module.scss';
import { Receipt } from 'lucide-react';

const ExpenseRoute = () => {
    return (
        <NavLink
            to="/expense"
            className={({ isActive }) => cx(styles.navItem, isActive && styles.active)}
        >
            <Receipt size={18} strokeWidth={1.5} />

            <span>Expense</span>
        </NavLink>
    );
};

export const ExpensePagesNavLinks = () => {
    const [people, setPeople] = useState<Person[]>([]);

    useEffect(() => {
        peopleService.list().then((data) => {
            setPeople(data);
        });
    }, []);

    return people.length > 1 ? (
        <>
            <ExpenseRoute />

            <NavLink
                key="expense-personal"
                to={`/expense/personal`}
                className={({ isActive }) => cx(styles.subLink, isActive && styles.subLinkActive)}
            >
                <span>Personal</span>
            </NavLink>

            <NavLink
                key="expense-joint"
                to={`/expense/joint`}
                className={({ isActive }) => cx(styles.subLink, isActive && styles.subLinkActive)}
            >
                <span>Joint</span>
            </NavLink>
        </>
    ) : (
        <ExpenseRoute />
    );
};
