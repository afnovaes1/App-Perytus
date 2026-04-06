import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, LogOut, Plus, Search, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { getReports, deleteReport, ReportRecord } from '@/services/reports'
import { format } from 'date-fns'

export default function Index() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = () => {
    getReports().then(setReports).catch(console.error)
  }

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Tem certeza que deseja excluir este laudo?')) {
      await deleteReport(id)
      loadReports()
    }
  }

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif text-primary font-bold mb-2">Meus Laudos Técnicos</h1>
          <p className="text-muted-foreground text-lg">
            Gerencie e crie novos documentos técnicos de engenharia.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-5 w-5" /> Sair
          </Button>
          <Button
            size="lg"
            className="gap-2 shadow-elevation"
            onClick={() => navigate('/laudo/novo')}
          >
            <Plus className="h-5 w-5" /> Novo Laudo
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-border pb-4 rounded-t-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl">Laudos Recentes</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-9 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Nenhum laudo encontrado.</div>
            ) : (
              filtered.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/laudo/${report.id}`)}
                >
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800">
                        {report.title || 'Sem título'}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {report.id}
                        </span>
                        <span>Criado em: {format(new Date(report.created), 'dd/MM/yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(report.id, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto sm:ml-0"
                      onClick={() => navigate(`/laudo/${report.id}`)}
                    >
                      Abrir
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
