import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
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

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">Consolidação e Parecer</h1>
        <p className="text-muted-foreground text-lg">
          Forneça o veredito final e as recomendações técnicas baseadas em toda a análise.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-3">
          <Label className="text-lg font-serif text-primary">Conclusão Técnica</Label>
          <p className="text-sm text-muted-foreground">O resumo definitivo do laudo.</p>
          <Textarea
            placeholder="Ex: Conclui-se que os danos estruturais são decorrentes de..."
            className="min-h-[200px]"
            value={data.consolidacao.conclusao}
            onChange={(e) => updateSection('consolidacao', { conclusao: e.target.value })}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-3">
          <Label className="text-lg font-serif text-primary">Recomendações Técnicas</Label>
          <p className="text-sm text-muted-foreground">
            Passos que devem ser tomados para mitigar ou resolver os problemas.
          </p>
          <Textarea
            placeholder="Ex: 1. Contratação de projeto de reforço estrutural. 2. Monitoramento mensal das fissuras..."
            className="min-h-[200px]"
            value={data.consolidacao.recomendacoes}
            onChange={(e) => updateSection('consolidacao', { recomendacoes: e.target.value })}
          />
        </div>
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
