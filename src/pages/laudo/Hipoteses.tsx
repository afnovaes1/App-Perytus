import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Hipoteses() {
  const { id } = useParams()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const hip = data.hipoteses.principal

  const handleChange = (field: string, value: string) => {
    updateSection('hipoteses', { principal: { ...hip, [field]: value } })
  }

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Hipóteses salvas.' })
    navigate(`/laudo/${id}/consolidacao`)
  }

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-6 border-b-2 border-[#2b579a] pb-2">
        <h2 className="text-[#2b579a] font-serif font-bold text-2xl">4. Hipóteses e Análise</h2>
      </div>

      <div className="space-y-6">
        <h3 className="text-[#2b579a] font-bold text-lg">4.1 Hipótese Principal</h3>

        <div className="pl-4 space-y-6">
          <Textarea
            placeholder="Descreva a hipótese principal (ex: vazamento mais chuva derrubaram suporte do solo provocando recalque)"
            value={hip.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
            className="min-h-[100px] text-sm"
          />

          <div className="space-y-2">
            <Label className="font-bold text-slate-800">Critérios de descarte:</Label>
            <Textarea
              placeholder="Ex: a investigar"
              value={hip.criterios}
              onChange={(e) => handleChange('criterios', e.target.value)}
              className="min-h-[60px] text-sm"
            />
          </div>

          <div className="space-y-2 max-w-sm">
            <Label className="font-bold text-slate-800">Grau de confiança:</Label>
            <Select value={hip.confianca} onValueChange={(v) => handleChange('confianca', v)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
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
