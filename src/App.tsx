import { Navigate, Route, Routes } from 'react-router-dom';
import { ArrowLeftRight, CreditCard, Landmark, User, Users } from 'lucide-react';
import Placeholder from './pages/Placeholder/Placeholder';
import Styleguide from './pages/Styleguide/Styleguide';
import { Shell } from './layout/Shell/Shell.tsx';
import { People } from './pages/People/People.tsx';
import { IncomeIndexRedirect } from './pages/Income/IncomeIndexRedirect.tsx';
import { IncomePersonPage } from './pages/Income/IncomePersonPage.tsx';
import { IncomeJointPage } from './pages/IncomeJointPage/IncomeJointPage.tsx';
import { ExpensePersonalPage } from './pages/Expense/ExpensePersonal.tsx';
import { ExpenseJointPage } from './pages/Expense/ExpenseJoint.tsx';

export default function App() {
    return (
        <Shell>
            <Routes>
                <Route path="/" element={<Navigate to="/people" replace />} />

                <Route path="/people" element={<People />} />

                <Route path="/income" element={<IncomeIndexRedirect />} />
                <Route path="/income/:personId" element={<IncomePersonPage />} />
                <Route path="/income/joint" element={<IncomeJointPage />} />

                <Route path="/expense" element={<Navigate to="/expense/personal" replace />} />
                <Route path="/expense/personal" element={<ExpensePersonalPage />} />
                <Route path="/expense/joint" element={<ExpenseJointPage />} />

                <Route
                    path="/personal"
                    element={
                        <Placeholder
                            icon={User}
                            title="Personal spread"
                            desc="Recurring monthly expenses come off income first. What is left is allocated to buckets."
                            editable
                        />
                    }
                />
                <Route
                    path="/joint"
                    element={
                        <Placeholder
                            icon={Users}
                            title="Joint spread"
                            desc="Each expense is split by the rounded % from People unless it has a custom split. Rounded slices use the rounded total."
                            editable
                        />
                    }
                />
                <Route
                    path="/debt"
                    element={
                        <Placeholder
                            icon={CreditCard}
                            title="Debt"
                            desc="Loans you have, have paid off, or are planning. Set the monthly payment or the term in months; the other is calculated and the maturity date follows from the origination date. Only active loans count in totals."
                            editable
                        />
                    }
                />
                <Route
                    path="/transfers"
                    element={
                        <Placeholder
                            icon={ArrowLeftRight}
                            title="Relative monthly transfers"
                            desc="Fixed recurring amounts per account, minus what is already sitting there, gives the transfer to make this month."
                        />
                    }
                />
                <Route
                    path="/nwr"
                    element={
                        <Placeholder
                            icon={Landmark}
                            title="Net worth review"
                            desc="A half-yearly snapshot of assets and liabilities. Starting a new review freezes the previous one, so linked values keep the figures from that date."
                            editable
                        />
                    }
                />

                <Route path="/styleguide" element={<Styleguide />} />

                <Route path="*" element={<Navigate to="/people" replace />} />
            </Routes>
        </Shell>
    );
}
