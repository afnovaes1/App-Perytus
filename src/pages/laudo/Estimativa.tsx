import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Estimativa() {
  const { id } = useParams()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Estimativa salva.' })
    navigate(`/laudo/${id}/encerramento`)
  }

  const handleUpdate = (field: string, value: string) => {
    updateSection('estimativa', { [field]: value ? Number(value) : '' })
  }

  const { compreensao, estudo, organizacao, tratamento, consolidacao } = data.estimativa
  const total =
    (Number(compreensao) || 0) +
    (Number(estudo) || 0) +
    (Number(organizacao) || 0) +
    (Number(tratamento) || 0) +
    (Number(consolidacao) || 0)

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-6 border-b-2 border-[#2b579a] pb-2">
        <h2 className="text-[#2b579a] font-serif font-bold text-2xl">
          9. Estimativa Orientativa de Esforço Técnico
        </h2>
      </div>

      <p className="text-sm text-slate-700 mb-8 italic">
        A estimativa a seguir constitui aproximação baseada em parâmetros usuais de trabalho
        pericial, considerando o volume de informações e registros indicados neste documento.
      </p>

      <div className="space-y-4 max-w-lg mb-8">
        <div className="grid grid-cols-[1fr_80px_20px] items-center gap-2">
          <Label className="text-sm font-semibold text-slate-700">
            • Compreensão inicial do caso:
          </Label>
          <Input
            type="number"
            step="0.1"
            value={compreensao}
            onChange={(e) => handleUpdate('compreensao', e.target.value)}
            className="h-8 text-right"
          />
          <span className="text-sm font-medium">h</span>
        </div>
        <div className="grid grid-cols-[1fr_80px_20px] items-center gap-2">
          <Label className="text-sm font-semibold text-slate-700">• Estudo documental:</Label>
          <Input
            type="number"
            step="0.1"
            value={estudo}
            onChange={(e) => handleUpdate('estudo', e.target.value)}
            className="h-8 text-right"
          />
          <span className="text-sm font-medium">h</span>
        </div>
        <div className="grid grid-cols-[1fr_80px_20px] items-center gap-2">
          <Label className="text-sm font-semibold text-slate-700">
            • Organização técnica e formulação de hipóteses:
          </Label>
          <Input
            type="number"
            step="0.1"
            value={organizacao}
            onChange={(e) => handleUpdate('organizacao', e.target.value)}
            className="h-8 text-right"
          />
          <span className="text-sm font-medium">h</span>
        </div>
        <div className="grid grid-cols-[1fr_80px_20px] items-center gap-2">
          <Label className="text-sm font-semibold text-slate-700">
            • Tratamento e inserção de imagens:
          </Label>
          <Input
            type="number"
            step="0.1"
            value={tratamento}
            onChange={(e) => handleUpdate('tratamento', e.target.value)}
            className="h-8 text-right"
          />
          <span className="text-sm font-medium">h</span>
        </div>
        <div className="grid grid-cols-[1fr_80px_20px] items-center gap-2">
          <Label className="text-sm font-semibold text-slate-700">
            • Consolidação e redação do documento:
          </Label>
          <Input
            type="number"
            step="0.1"
            value={consolidacao}
            onChange={(e) => handleUpdate('consolidacao', e.target.value)}
            className="h-8 text-right"
          />
          <span className="text-sm font-medium">h</span>
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="font-bold text-slate-800 text-lg">Total estimado: {total.toFixed(1)}h</p>
      </div>

      <div className="flex justify-end pt-8 mt-8 border-t">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-4 w-4" /> Salvar e Continuar
        </Button>
      </div>
    </div>
  )
}
