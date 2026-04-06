import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ReportProvider } from '@/context/ReportContext'

import Layout from './components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import { WizardLayout } from './components/WizardLayout'
import Identificacao from './pages/laudo/Identificacao'
import Manifestacoes from './pages/laudo/Manifestacoes'
import Evidencias from './pages/laudo/Evidencias'
import Hipoteses from './pages/laudo/Hipoteses'
import Consolidacao from './pages/laudo/Consolidacao'
import Metodologia from './pages/laudo/Metodologia'
import Anexos from './pages/laudo/Anexos'
import Classificacao from './pages/laudo/Classificacao'
import Encerramento from './pages/laudo/Encerramento'
import Estimativa from './pages/laudo/Estimativa'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />

          <Route
            path="/laudo/novo"
            element={
              <ReportProvider>
                <WizardLayout />
              </ReportProvider>
            }
          >
            <Route index element={<Navigate to="identificacao" replace />} />
            <Route path="identificacao" element={<Identificacao />} />
            <Route path="manifestacoes" element={<Manifestacoes />} />
            <Route path="evidencias" element={<Evidencias />} />
            <Route path="hipoteses" element={<Hipoteses />} />
            <Route path="consolidacao" element={<Consolidacao />} />
            <Route path="metodologia" element={<Metodologia />} />
            <Route path="anexos" element={<Anexos />} />
            <Route path="classificacao" element={<Classificacao />} />
            <Route path="encerramento" element={<Encerramento />} />
            <Route path="estimativa" element={<Estimativa />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
