import { Navigate, Route, Routes } from 'react-router-dom';
import { PAGES } from './navigation.tsx';
import Placeholder from './pages/Placeholder/Placeholder';
import Styleguide from './pages/Styleguide/Styleguide';
import { IncomePersonPage } from './pages/Income/IncomePersonPage.tsx';
import { IncomeIndexRedirect } from './pages/Income/IncomeIndexRedirect.tsx';
import { Shell } from './layout/Shell/Shell.tsx';
import { IncomeJointPage } from './pages/IncomeJointPage/IncomeJointPage.tsx';

export default function App() {
    return (
        <Shell>
            <Routes>
                <Route path="/" element={<Navigate to={PAGES[0].path} replace />} />

                {PAGES.filter((p) => p.path !== '/income').map((p) => (
                    <Route
                        key={p.path}
                        path={p.path}
                        element={p?.element ? p.element : <Placeholder page={p} />}
                    />
                ))}

                <Route path="/income" element={<IncomeIndexRedirect />} />

                <Route path="/income/:personId" element={<IncomePersonPage />} />

                <Route path="/income/joint" element={<IncomeJointPage />} />

                <Route path="/styleguide" element={<Styleguide />} />

                <Route path="*" element={<Navigate to={PAGES[0].path} replace />} />
            </Routes>
        </Shell>
    );
}
