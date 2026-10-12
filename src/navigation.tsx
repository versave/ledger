import type { LucideIcon } from 'lucide-react';
import {
    ArrowLeftRight,
    CreditCard,
    Landmark,
    User,
    Users,
    UsersRound,
    Wallet,
} from 'lucide-react';
import { ReactElement } from 'react';
import { IncomePage } from './pages/Income/Income.tsx';
import { People } from './pages/People/People.tsx';

export interface PageDef {
    path: string;
    label: string;
    icon: LucideIcon;
    title: string;
    desc: string;
    editable: boolean;
    element?: ReactElement;
}

export const PAGES: PageDef[] = [
    {
        path: '/people',
        label: 'People',
        icon: UsersRound,
        title: 'People',
        desc: 'Everyone in this ledger. Each person gets their own Income page. The first person is you and drives the Personal spread.',
        editable: true,
        element: <People />,
    },
    {
        path: '/income',
        label: 'Income',
        icon: Wallet,
        title: 'Income',
        desc: 'Enter either the monthly or the yearly amount; the other is calculated. The monthly total counts monthly items only.',
        editable: true,
        element: <IncomePage />,
    },
    {
        path: '/personal',
        label: 'Personal spread',
        icon: User,
        title: 'Personal spread',
        desc: 'Recurring monthly expenses come off income first. What is left is allocated to buckets.',
        editable: true,
    },
    {
        path: '/joint',
        label: 'Joint spread',
        icon: Users,
        title: 'Joint spread',
        desc: 'Each expense is split by the rounded % from People unless it has a custom split. Rounded slices use the rounded total.',
        editable: true,
    },
    {
        path: '/debt',
        label: 'Debt',
        icon: CreditCard,
        title: 'Debt',
        desc: 'Loans you have, have paid off, or are planning. Set the monthly payment or the term in months; the other is calculated and the maturity date follows from the origination date. Only active loans count in totals.',
        editable: true,
    },
    {
        path: '/transfers',
        label: 'Monthly transfers',
        icon: ArrowLeftRight,
        title: 'Relative monthly transfers',
        desc: 'Fixed recurring amounts per account, minus what is already sitting there, gives the transfer to make this month.',
        editable: false,
    },
    {
        path: '/nwr',
        label: 'Net worth review',
        icon: Landmark,
        title: 'Net worth review',
        desc: 'A half-yearly snapshot of assets and liabilities. Starting a new review freezes the previous one, so linked values keep the figures from that date.',
        editable: true,
    },
];
