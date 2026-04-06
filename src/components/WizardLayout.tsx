import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  FileText,
  Eye,
  Search,
  Lightbulb,
  CheckSquare,
  ClipboardList,
  Paperclip,
  BarChart2,
  Flag,
  CheckCircle2,
} from 'lucide-react'
import { useReport } from '@/context/ReportContext'
import { cn } from '@/lib/utils'

const tabs = [
  {
    id: 'identificacao',
    label: 'Identificação',
    icon: FileText,
    path: '/laudo/novo/identificacao',
  },
  { id: 'manifestacoes', label: 'Manifestações', icon: Eye, path: '/laudo/novo/manifestacoes' },
  { id: 'evidencias', label: 'Evidências', icon: Search, path: '/laudo/novo/evidencias' },
  { id: 'hipoteses', label: 'Hipóteses', icon: Lightbulb, path: '/laudo/novo/hipoteses' },
  {
    id: 'consolidacao',
    label: 'Consolidação',
    icon: CheckSquare,
    path: '/laudo/novo/consolidacao',
  },
  { id: 'metodologia', label: 'Metodologia', icon: ClipboardList, path: '/laudo/novo/metodologia' },
  { id: 'anexos', label: 'Anexos', icon: Paperclip, path: '/laudo/novo/anexos' },
  {
    id: 'classificacao',
    label: 'Classificação',
    icon: BarChart2,
    path: '/laudo/novo/classificacao',
  },
  { id: 'encerramento', label: 'Encerramento', icon: Flag, path: '/laudo/novo/encerramento' },
]

export function WizardLayout() {
  const location = useLocation()
  const { data } = useReport()

  const isCompleted = (tabId: string) => {
    switch (tabId) {
      case 'identificacao':
        return !!(
          data.identificacao.destinatario &&
          data.identificacao.local &&
          data.identificacao.data
        )
      case 'manifestacoes':
        return data.manifestacoes.length > 0
      case 'evidencias':
        return Object.values(data.evidencias).some((v) => v.length > 0)
      case 'hipoteses':
        return !!data.hipoteses.texto
      case 'consolidacao':
        return !!data.consolidacao.conclusao
      case 'metodologia':
        return data.metodologia.procedimentosAdotados.length > 0
      case 'anexos':
        return data.anexos.tipos.length > 0 || !!data.anexos.descricaoAdicional
      case 'classificacao':
        return !!data.classificacao.estadoDesempenho.classe && !!data.classificacao.prioridade.grau
      case 'encerramento':
        return false
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-workspace">
      {/* Top Navigation Area */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center py-4 mb-2">
            <div className="flex items-center gap-2 text-primary font-serif text-xl font-bold">
              <ClipboardList className="h-6 w-6" />
              <span>LaudoTech</span>
            </div>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const active = location.pathname === tab.path
              const completed = isCompleted(tab.id)

              return (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  className={cn(
                    'relative flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap',
                    active
                      ? 'text-primary bg-workspace rounded-t-lg border-t-2 border-primary border-x border-x-border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-gray-50',
                  )}
                >
                  <tab.icon
                    className={cn('h-4 w-4', active ? 'text-primary' : 'text-muted-foreground')}
                  />
                  {tab.label}
                  {completed && <CheckCircle2 className="h-4 w-4 text-green-600 ml-1" />}
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Outlet />
      </div>
    </div>
  )
}
