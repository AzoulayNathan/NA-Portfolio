import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { I18nProvider } from '@/lib/i18n';
import { SandRainProvider } from '@/lib/SandRainContext';
import { PageSandProvider } from '@/lib/PageSandContext';
import { SandPileBottom } from '@/components/layout/PageSandAccumulation';

import Home from './pages/Home';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Tools from './pages/Tools';
import Contact from './pages/Contact';

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
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
                <SandPileBottom />
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
