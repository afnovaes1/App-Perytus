import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

export default function Classificacao() {
  const { id } = useParams()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const { estadoDesempenho, prioridade, matrizGUT } = data.classificacao
  const { gravidade, urgencia, tendencia } = matrizGUT

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Classificação salva.' })
    navigate(`/laudo/${id}/referencias`)
  }

  const score = (Number(gravidade) || 0) * (Number(urgencia) || 0) * (Number(tendencia) || 0)

  let label = 'Indefinida'
  if (score > 0) {
    if (score <= 10) label = 'Baixa'
    else if (score <= 40) label = 'Moderada'
    else if (score <= 75) label = 'Alta'
    else label = 'Crítica'
  }

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-6 border-b-2 border-[#2b579a] pb-2">
        <h2 className="text-[#2b579a] font-serif font-bold text-2xl">
          12. Classificação Metodológica
        </h2>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-[#2b579a] font-bold text-lg mb-4">
            12.1 Estado Aparente de Desempenho
          </h3>
          <div className="max-w-md flex items-center gap-4">
            <Label className="font-semibold whitespace-nowrap">Classificação:</Label>
            <Select
              value={estadoDesempenho}
              onValueChange={(v) => updateSection('classificacao', { estadoDesempenho: v })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Classe 1 - Desempenho adequado">
                  Classe 1 - Desempenho adequado
                </SelectItem>
                <SelectItem value="Classe 2 - Desempenho regular">
                  Classe 2 - Desempenho regular
                </SelectItem>
                <SelectItem value="Classe 3 - Desempenho inadequado">
                  Classe 3 - Desempenho inadequado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h3 className="text-[#2b579a] font-bold text-lg mb-4">
            12.2 Classificação de Prioridade (NBR 16747)
          </h3>
          <div className="max-w-md flex items-center gap-4">
            <Label className="font-semibold whitespace-nowrap">Classificação:</Label>
            <Select
              value={prioridade}
              onValueChange={(v) => updateSection('classificacao', { prioridade: v })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prioridade 1 - Intervenção imediata">
                  Prioridade 1 - Intervenção imediata
                </SelectItem>
                <SelectItem value="Prioridade 2 - Intervenção a curto prazo">
                  Prioridade 2 - Intervenção a curto prazo
                </SelectItem>
                <SelectItem value="Prioridade 3 - Intervenção a médio/longo prazo">
                  Prioridade 3 - Intervenção a médio/longo prazo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h3 className="text-[#2b579a] font-bold text-lg mb-4">
            12.3 Matriz GUT (Gravidade × Urgência × Tendência)
          </h3>

          <div className="grid gap-6 max-w-xl pl-2 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="font-semibold text-slate-700">
                  Gravidade (G): {gravidade || 0}
                </Label>
              </div>
              <Slider
                value={[Number(gravidade) || 0]}
                min={0}
                max={5}
                step={1}
                onValueChange={(v) =>
                  updateSection('classificacao', { matrizGUT: { ...matrizGUT, gravidade: v[0] } })
                }
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="font-semibold text-slate-700">
                  Urgência (U): {urgencia || 0}
                </Label>
              </div>
              <Slider
                value={[Number(urgencia) || 0]}
                min={0}
                max={5}
                step={1}
                onValueChange={(v) =>
                  updateSection('classificacao', { matrizGUT: { ...matrizGUT, urgencia: v[0] } })
                }
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="font-semibold text-slate-700">
                  Tendência (T): {tendencia || 0}
                </Label>
              </div>
              <Slider
                value={[Number(tendencia) || 0]}
                min={0}
                max={5}
                step={1}
                onValueChange={(v) =>
                  updateSection('classificacao', { matrizGUT: { ...matrizGUT, tendencia: v[0] } })
                }
              />
            </div>
          </div>

          <div className="bg-slate-50 border p-4 rounded-lg flex gap-8 items-center max-w-xl">
            <p className="font-bold text-slate-800 text-lg">
              Índice de Importância (G × U × T): {score}
            </p>
            <p className="font-bold text-slate-800 text-lg">Classificação: {label}</p>
          </div>
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
