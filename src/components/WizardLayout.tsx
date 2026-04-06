import React from 'react'
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
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
  Calculator,
  BookOpen,
} from 'lucide-react'
import { useReport } from '@/context/ReportContext'
import { cn } from '@/lib/utils'

export function WizardLayout() {
  const location = useLocation()
  const { id } = useParams()
  const { data, loading } = useReport()

  const tabs = [
    {
      id: 'identificacao',
      label: '1. Identificação',
      icon: FileText,
      path: `/laudo/${id}/identificacao`,
    },
    {
      id: 'manifestacoes',
      label: '2. Manifestações',
      icon: Eye,
      path: `/laudo/${id}/manifestacoes`,
    },
    { id: 'evidencias', label: '3. Evidências', icon: Search, path: `/laudo/${id}/evidencias` },
    { id: 'hipoteses', label: '4. Hipóteses', icon: Lightbulb, path: `/laudo/${id}/hipoteses` },
    {
      id: 'consolidacao',
      label: '5. Consolidação',
      icon: CheckSquare,
      path: `/laudo/${id}/consolidacao`,
    },
    {
      id: 'metodologia',
      label: '6-8. Metodologia',
      icon: ClipboardList,
      path: `/laudo/${id}/metodologia`,
    },
    { id: 'estimativa', label: '9. Estimativa', icon: Calculator, path: `/laudo/${id}/estimativa` },
    {
      id: 'encerramento',
      label: '10. Encerramento',
      icon: Flag,
      path: `/laudo/${id}/encerramento`,
    },
    { id: 'anexos', label: '11. Anexos', icon: Paperclip, path: `/laudo/${id}/anexos` },
    {
      id: 'classificacao',
      label: '12. Classificação',
      icon: BarChart2,
      path: `/laudo/${id}/classificacao`,
    },
    {
      id: 'referencias',
      label: '13-14. Referências',
      icon: BookOpen,
      path: `/laudo/${id}/referencias`,
    },
  ]

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground">Carregando dados do laudo...</div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-workspace">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center py-4 mb-2">
            <div className="flex items-center gap-2 text-primary font-serif text-xl font-bold">
              <ClipboardList className="h-6 w-6" />
              <span>LaudoTech</span>
            </div>
            <div className="ml-4 pl-4 border-l border-border text-sm font-medium text-slate-600 truncate max-w-md">
              {data.identificacao.destinatario || 'Novo Laudo'}
            </div>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const active = location.pathname === tab.path
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
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Outlet />
      </div>
    </div>
  )
}
