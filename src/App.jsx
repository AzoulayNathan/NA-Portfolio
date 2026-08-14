import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { I18nProvider } from '@/lib/i18n';
import { SandRainProvider, useSandRain } from '@/lib/SandRainContext';
import { PageSandProvider } from '@/lib/PageSandContext';
import { SandPileBottom } from '@/components/layout/PageSandAccumulation';

import Home from './pages/Home';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Tools from './pages/Tools';
import Contact from './pages/Contact';
import ClassroomShell from './pages/ClassroomShell';
import TeachingHybrid from './pages/TeachingHybrid';
import Websites from './pages/Websites';
import Expertise from './pages/Expertise';

function SandPileGate() {
  const { enabled } = useSandRain();
  const { pathname } = useLocation();
  if (!enabled || pathname.startsWith('/classroom') || pathname === '/websites' || pathname.startsWith('/expertise')) return null;
  return <SandPileBottom />;
}

function App() {
  return (
    <I18nProvider>
      <SandRainProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <PageSandProvider>
              <div className="relative">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/experience" element={<Experience />} />
                  <Route path="/tools" element={<Tools />} />
                  <Route path="/expertise" element={<Expertise />} />
                  <Route path="/expertise/:fieldId" element={<Expertise />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/classroom/contact" element={<Navigate to="/classroom/book-a-lesson" replace />} />
                  <Route path="/classroom/teaching" element={<TeachingHybrid />} />
                  <Route path="/classroom/*" element={<ClassroomShell />} />
                  <Route path="/websites" element={<Websites />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
                <SandPileGate />
              </div>
            </PageSandProvider>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </SandRainProvider>
    </I18nProvider>
  )
}

export default App
