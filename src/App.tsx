import { Navigate, Route, Routes } from 'react-router-dom';
import { PAGES } from './navigation.tsx';
import Placeholder from './pages/Placeholder/Placeholder';
import Styleguide from './pages/Styleguide/Styleguide';
import { IncomePersonPage } from './pages/Income/IncomePersonPage.tsx';
import { Shell } from './layout/Shell/Shell.tsx';

export default function App() {
    return (
        <Shell>
            <Routes>
                <Route path="/" element={<Navigate to={PAGES[0].path} replace />} />

                {PAGES.map((p) => (
                    <Route
                        key={p.path}
                        path={p.path}
                        element={p?.element ? p.element : <Placeholder page={p} />}
                    />
                ))}

                <Route path="/income/:personId" element={<IncomePersonPage />} />

                <Route path="/styleguide" element={<Styleguide />} />

                <Route path="*" element={<Navigate to={PAGES[0].path} replace />} />
            </Routes>
        </Shell>
    );
}
