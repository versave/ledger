import type {LucideIcon} from 'lucide-react'
import {ArrowLeftRight, CreditCard, Landmark, User, Users, Wallet} from 'lucide-react'

export interface PageDef {
	path: string
	label: string
	icon: LucideIcon
	title: string
	desc: string
	editable: boolean
}

export const PAGES: PageDef[] = [
	{
		path: '/income',
		label: 'Income',
		icon: Wallet,
		title: 'Income',
		desc: 'Enter either the monthly or the yearly amount; the other is calculated. The monthly total counts monthly items only.',
		editable: true,
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
]
