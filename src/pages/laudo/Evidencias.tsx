import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { HelpCircle, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Evidencias() {
  const { data, updateSection } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const filledCount = Object.values(data.evidencias).filter((v) => v.trim().length > 0).length

  const handleSave = () => {
    toast({
      title: 'Sucesso',
      description: 'Evidências salvas com sucesso.',
    })
    navigate('/laudo/novo/hipoteses')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">Evidências e Aprofundamento</h1>
        <p className="text-muted-foreground text-lg">
          Perguntas provocativas para transformar observação em material técnico
        </p>
      </div>

      <div className="bg-[#f0ece1] border border-[#e6dfcc] rounded-lg p-4 mb-6 flex items-start gap-3">
        <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-slate-800 leading-relaxed">
          <strong>Estas perguntas são opcionais</strong>, mas podem enriquecer significativamente
          sua análise técnica. Responda apenas aquelas que forem relevantes para o caso.
        </p>
      </div>

      <div className="mb-4 text-sm font-medium text-slate-600">
        Campos preenchidos: <span className="text-primary">{filledCount} de 4</span>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-2 transition-all focus-within:ring-1 focus-within:ring-primary">
          <Label className="text-base font-semibold">Houve monitoramento?</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Descreva se foram realizados monitoramentos, medições ou acompanhamentos sistemáticos.
          </p>
          <Textarea
            placeholder="Ex: Sim, selo de gesso instalado há 3 meses não apresentou rompimento."
            className="min-h-[100px] border-slate-200"
            value={data.evidencias.monitoramento}
            onChange={(e) => updateSection('evidencias', { monitoramento: e.target.value })}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-2 transition-all focus-within:ring-1 focus-within:ring-primary">
          <Label className="text-base font-semibold">Relação com eventos externos?</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Há correlação com eventos climáticos, obras vizinhas, uso do imóvel ou outras causas
            externas?
          </p>
          <Textarea
            placeholder="Ex: Chuvas intensas recentes e vazamentos da tubulação superior."
            className="min-h-[100px] border-slate-200"
            value={data.evidencias.eventos}
            onChange={(e) => updateSection('evidencias', { eventos: e.target.value })}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-2 transition-all focus-within:ring-1 focus-within:ring-primary">
          <Label className="text-base font-semibold">Manifestações associadas?</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Existem outras manifestações que podem estar relacionadas ao problema principal?
          </p>
          <Textarea
            placeholder="Ex: Trincas na laje acompanham o padrão das fissuras de parede."
            className="min-h-[100px] border-slate-200"
            value={data.evidencias.associadas}
            onChange={(e) => updateSection('evidencias', { associadas: e.target.value })}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-2 transition-all focus-within:ring-1 focus-within:ring-primary">
          <Label className="text-base font-semibold">Registros comparativos?</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Existem registros anteriores, fotos antigas ou laudos prévios para comparação?
          </p>
          <Textarea
            placeholder="Ex: Fotos de 2020 mostram que a fissura era menor..."
            className="min-h-[100px] border-slate-200"
            value={data.evidencias.comparativos}
            onChange={(e) => updateSection('evidencias', { comparativos: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-4 w-4" />
          Salvar evidências
        </Button>
      </div>
    </div>
  )
}
