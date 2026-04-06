import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Evidencias() {
  const { id } = useParams()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Evidências salvas com sucesso.' })
    navigate(`/laudo/${id}/hipoteses`)
  }

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-8 border-b-2 border-[#2b579a] pb-2">
        <h2 className="text-[#2b579a] font-serif font-bold text-2xl">
          3. Evidências e Aprofundamento
        </h2>
      </div>

      <div className="space-y-6 text-sm">
        <div className="space-y-2">
          <Label className="font-bold text-slate-800">Monitoramento:</Label>
          <Input
            value={data.evidencias.monitoramento}
            onChange={(e) => updateSection('evidencias', { monitoramento: e.target.value })}
            placeholder="Ex: sim, selo de gesso"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-slate-800">Relação com eventos externos:</Label>
          <Input
            value={data.evidencias.eventos}
            onChange={(e) => updateSection('evidencias', { eventos: e.target.value })}
            placeholder="Ex: chuvas e vazamentos da tubulação"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-slate-800">Manifestações associadas:</Label>
          <Input
            value={data.evidencias.associadas}
            onChange={(e) => updateSection('evidencias', { associadas: e.target.value })}
            placeholder="Ex: trincas na laje"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end pt-8 mt-8">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-4 w-4" /> Salvar e Continuar
        </Button>
      </div>
    </div>
  )
}
