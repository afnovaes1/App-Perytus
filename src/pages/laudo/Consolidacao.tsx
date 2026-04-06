import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Consolidacao() {
  const { id } = useParams()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Consolidação salva.' })
    navigate(`/laudo/${id}/metodologia`)
  }

  const handleUpdate = (field: string, value: string) => {
    updateSection('consolidacao', { [field]: value })
  }

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-6 border-b-2 border-[#2b579a] pb-2">
        <h2 className="text-[#2b579a] font-serif font-bold text-2xl">5. Consolidação</h2>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-[#2b579a] font-bold text-lg mb-2">5.1 Diagnóstico</h3>
          <Textarea
            value={data.consolidacao.diagnostico}
            onChange={(e) => handleUpdate('diagnostico', e.target.value)}
            className="min-h-[80px]"
            placeholder="Conclusão técnica sobre a origem e natureza do problema"
          />
        </div>

        <div>
          <h3 className="text-[#2b579a] font-bold text-lg mb-2">5.2 Prognóstico</h3>
          <Textarea
            value={data.consolidacao.prognostico}
            onChange={(e) => handleUpdate('prognostico', e.target.value)}
            className="min-h-[80px]"
            placeholder="Evolução esperada do problema sem intervenção"
          />
        </div>

        <div>
          <h3 className="text-[#2b579a] font-bold text-lg mb-2">5.3 Recomendações</h3>
          <Textarea
            value={data.consolidacao.recomendacoes}
            onChange={(e) => handleUpdate('recomendacoes', e.target.value)}
            className="min-h-[80px]"
            placeholder="Medidas técnicas recomendadas para tratamento"
          />
        </div>

        <div>
          <h3 className="text-[#2b579a] font-bold text-lg mb-2">5.4 Limitações</h3>
          <Textarea
            value={data.consolidacao.limitacoes}
            onChange={(e) => handleUpdate('limitacoes', e.target.value)}
            className="min-h-[80px]"
            placeholder="Restrições e ressalvas"
          />
        </div>
      </div>

      <div className="flex justify-end pt-8 mt-8 border-t">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-4 w-4" /> Salvar e Continuar
        </Button>
      </div>
    </div>
  )
}
