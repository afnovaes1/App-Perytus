import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardCheck, Ban, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PROCEDIMENTOS = [
  'Vistoria visual',
  'Registro fotográfico',
  'Medições simples',
  'Análise documental',
  'Relatos de usuários/responsáveis',
  'Monitoramento',
  'Outros',
]

const LIMITACOES = [
  'Áreas inacessíveis',
  'Ausência de projetos',
  'Impossibilidade de ensaios',
  'Limitações temporais',
  'Impossibilidade de monitoramento prolongado',
  'Outras',
]

export default function Metodologia() {
  const { data, updateSection } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleFinish = () => {
    toast({
      title: 'Sucesso',
      description: 'Metodologia salva com sucesso.',
    })
    navigate('/')
  }

  const toggleProcedimento = (proc: string) => {
    const current = data.metodologia.procedimentosAdotados || []
    const updated = current.includes(proc) ? current.filter((p) => p !== proc) : [...current, proc]
    updateSection('metodologia', { procedimentosAdotados: updated })
  }

  const toggleLimitacao = (lim: string) => {
    const current = data.metodologia.limitacoesInvestigacao || []
    const updated = current.includes(lim) ? current.filter((l) => l !== lim) : [...current, lim]
    updateSection('metodologia', { limitacoesInvestigacao: updated })
  }

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate-800 mb-2">
          Metodologia da Investigação e Limitações da Análise
        </h1>
        <p className="text-muted-foreground text-lg">
          Explicite os procedimentos adotados e os limites interpretativos da investigação
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <ClipboardCheck className="w-5 h-5 text-slate-600" />
              Procedimentos Adotados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {PROCEDIMENTOS.map((proc) => (
                <div key={proc} className="flex items-center space-x-3">
                  <Checkbox
                    id={`proc-${proc}`}
                    checked={(data.metodologia.procedimentosAdotados || []).includes(proc)}
                    onCheckedChange={() => toggleProcedimento(proc)}
                  />
                  <Label
                    htmlFor={`proc-${proc}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 cursor-pointer"
                  >
                    {proc}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="detalhamento" className="text-sm text-slate-600 font-medium">
                Detalhamento dos procedimentos
              </Label>
              <Textarea
                id="detalhamento"
                placeholder="Descreva os procedimentos técnicos aplicados na investigação..."
                className="min-h-[120px] text-sm"
                value={data.metodologia.detalhamentoProcedimentos || ''}
                onChange={(e) =>
                  updateSection('metodologia', { detalhamentoProcedimentos: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <Ban className="w-5 h-5 text-slate-600" />
              Limitações da Investigação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {LIMITACOES.map((lim) => (
                <div key={lim} className="flex items-center space-x-3">
                  <Checkbox
                    id={`lim-${lim}`}
                    checked={(data.metodologia.limitacoesInvestigacao || []).includes(lim)}
                    onCheckedChange={() => toggleLimitacao(lim)}
                  />
                  <Label
                    htmlFor={`lim-${lim}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 cursor-pointer"
                  >
                    {lim}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="descricao-limitacoes" className="text-sm text-slate-600 font-medium">
                Descrição das limitações
              </Label>
              <Textarea
                id="descricao-limitacoes"
                placeholder="Descreva em detalhes as limitações encontradas durante a investigação..."
                className="min-h-[120px] text-sm"
                value={data.metodologia.descricaoLimitacoes || ''}
                onChange={(e) =>
                  updateSection('metodologia', { descricaoLimitacoes: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <Target className="w-5 h-5 text-slate-600" />
              Alcance Interpretativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="alcance" className="text-sm text-slate-600 font-medium">
                Descreva o grau de confiança das conclusões frente às evidências disponíveis
              </Label>
              <Textarea
                id="alcance"
                className="min-h-[120px] text-sm"
                value={data.metodologia.alcanceInterpretativo || ''}
                onChange={(e) =>
                  updateSection('metodologia', { alcanceInterpretativo: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-8">
        <Button onClick={handleFinish} size="lg">
          Salvar metodologia
        </Button>
      </div>
    </div>
  )
}
