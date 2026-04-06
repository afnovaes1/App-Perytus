import React from 'react'
import { Save, ChevronLeft, ChevronRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

export default function Encerramento() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data, updateSection } = useReport()

  const encerramento = data.encerramento || {
    classificacaoDocumento: '',
    consideracoesFinais: '',
    responsabilidadeTecnica: false,
  }

  const handleUpdate = (f: string, v: string | boolean) => updateSection('encerramento', { [f]: v })

  const classificacaoOptions = [
    {
      id: 'observacao',
      title: 'Observação Técnica',
      description: 'Registro inicial de observações sem análise aprofundada',
    },
    {
      id: 'relatorio',
      title: 'Relatório Técnico',
      description: 'Análise técnica com metodologia parcialmente aplicada',
    },
    {
      id: 'laudo',
      title: 'Laudo Técnico Estruturado',
      description: 'Documento completo com metodologia rigorosa',
    },
  ]

  const handleSave = () => {
    toast({
      title: 'Encerramento salvo',
      description: 'Considerações finais e responsabilidade técnica registradas.',
    })
    navigate('/laudo/novo/estimativa')
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-slate-800 mb-2">Encerramento Técnico</h1>
        <p className="text-muted-foreground text-lg">
          Forneça as considerações finais e assuma a responsabilidade técnica pelo laudo.
        </p>
      </div>

      <Card className="border-border/60 shadow-sm mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-500" />
            <CardTitle className="text-xl text-slate-800">Classificação do Documento</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {classificacaoOptions.map((opt) => (
            <div
              key={opt.id}
              onClick={() => handleUpdate('classificacaoDocumento', opt.id)}
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between',
                encerramento.classificacaoDocumento === opt.id
                  ? 'border-teal-600 bg-teal-50/30 ring-1 ring-teal-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white',
              )}
            >
              <div>
                <h4 className="font-semibold text-slate-800">{opt.title}</h4>
                <p className="text-sm text-slate-500">{opt.description}</p>
              </div>
              {encerramento.classificacaoDocumento === opt.id && (
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-slate-800">Considerações Finais</CardTitle>
          <CardDescription>
            Espaço reservado para o fecho do documento, conclusões gerais ou ressalvas adicionais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Insira aqui as considerações finais do laudo..."
            className="min-h-[200px] resize-y text-base"
            value={encerramento.consideracoesFinais}
            onChange={(e) => handleUpdate('consideracoesFinais', e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-slate-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="mt-1 bg-white p-2 rounded-full border border-slate-200 shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6 text-teal-700" />
            </div>
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="responsabilidade"
                className="text-base font-medium text-slate-800 cursor-pointer"
              >
                Responsabilidade Técnica
              </Label>
              <p className="text-sm text-slate-600 leading-relaxed">
                Declaro que as informações constantes neste laudo expressam a verdade e foram
                elaboradas de acordo com as normas técnicas vigentes, assumindo total
                responsabilidade técnica pelo conteúdo emitido.
              </p>
            </div>
            <div className="shrink-0 pt-2">
              <Switch
                id="responsabilidade"
                checked={encerramento.responsabilidadeTecnica}
                onCheckedChange={(v) => handleUpdate('responsabilidadeTecnica', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-8 space-y-6 border-t border-slate-200">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/laudo/novo/classificacao')}
            className="gap-2 w-full md:w-auto h-11"
          >
            <ChevronLeft className="w-4 h-4" /> Revisar classificação
          </Button>
          <Button
            onClick={handleSave}
            className="bg-slate-800 hover:bg-slate-900 text-white px-8 gap-2 w-full md:w-auto h-11"
          >
            <Save className="w-4 h-4 mr-1" /> Salvar encerramento
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
