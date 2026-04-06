import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, LogOut, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'

const mockReports = [
  { id: 'LD-2023-001', client: 'Condomínio Villa Verde', date: '10/10/2023', status: 'Concluído' },
  { id: 'LD-2023-002', client: 'Edifício San Marco', date: '15/10/2023', status: 'Rascunho' },
]

export default function Index() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

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
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
          <Button
            size="lg"
            className="gap-2 shadow-elevation"
            onClick={() => navigate('/laudo/novo/identificacao')}
          >
            <Plus className="h-5 w-5" />
            Novo Laudo
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
                placeholder="Buscar por cliente ou ID..."
                className="pl-9 bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">{report.client}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {report.id}
                      </span>
                      <span>{report.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${report.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                  >
                    {report.status}
                  </span>
                  <Button variant="outline" size="sm" className="ml-auto sm:ml-0">
                    Abrir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
