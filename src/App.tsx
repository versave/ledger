import { Navigate, Route, Routes } from 'react-router-dom'
import Shell from './layout/Shell/Shell'
import { PAGES } from './navigation'
import Placeholder from './pages/Placeholder/Placeholder'
import Styleguide from './pages/Styleguide/Styleguide'

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Navigate to={PAGES[0].path} replace />} />

        {PAGES.map((p) => (
          <Route key={p.path} path={p.path} element={<Placeholder page={p} />} />
        ))}

        <Route path="/styleguide" element={<Styleguide />} />

        <Route path="*" element={<Navigate to={PAGES[0].path} replace />} />
      </Routes>
    </Shell>
  )
}
