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
import Estimativa from './pages/laudo/Estimativa'
import Encerramento from './pages/laudo/Encerramento'
import Anexos from './pages/laudo/Anexos'
import Classificacao from './pages/laudo/Classificacao'
import Referencias from './pages/laudo/Referencias'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import NewReportRedirect from './pages/laudo/NewReportRedirect'

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/laudo/novo" element={<NewReportRedirect />} />

              <Route
                path="/laudo/:id"
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
                <Route path="estimativa" element={<Estimativa />} />
                <Route path="encerramento" element={<Encerramento />} />
                <Route path="anexos" element={<Anexos />} />
                <Route path="classificacao" element={<Classificacao />} />
                <Route path="referencias" element={<Referencias />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
