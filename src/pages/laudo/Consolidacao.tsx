import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Consolidacao() {
  const { data, updateSection } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = () => {
    toast({
      title: 'Sucesso',
      description: 'Consolidação salva com sucesso.',
    })
    navigate('/laudo/novo/metodologia')
  }

  const fields = [
    {
      id: 'diagnostico' as const,
      title: 'Diagnóstico',
      description: 'Conclusão técnica sobre a origem e natureza do problema',
    },
    {
      id: 'prognostico' as const,
      title: 'Prognóstico',
      description: 'Evolução esperada do problema sem intervenção',
    },
    {
      id: 'recomendacoes' as const,
      title: 'Recomendações',
      description: 'Medidas técnicas recomendadas para tratamento',
    },
    {
      id: 'limitacoes' as const,
      title: 'Limitações',
      description: 'Restrições metodológicas e ressalvas da análise',
    },
  ]

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate-800 mb-2">Consolidação</h1>
        <p className="text-muted-foreground text-lg">
          Sintetize suas conclusões e recomendações técnicas
        </p>
      </div>

      <Alert className="mb-8 bg-slate-50 border-slate-200 text-slate-800">
        <Info className="h-4 w-4 text-slate-600" />
        <AlertDescription className="ml-2 text-sm">
          A consolidação reúne os achados em conclusões técnicas. Não há obrigatoriedade de
          preenchimento de todos os campos — use apenas os que forem pertinentes ao caso.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {fields.map((field) => (
          <div
            key={field.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-3"
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-800">{field.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{field.description}</p>
            </div>
            <Textarea
              className="min-h-[120px] resize-y text-sm"
              value={data.consolidacao[field.id] || ''}
              onChange={(e) =>
                updateSection('consolidacao', {
                  [field.id]: e.target.value,
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-8">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-4 w-4" />
          Salvar consolidação
        </Button>
      </div>
    </div>
  )
}
