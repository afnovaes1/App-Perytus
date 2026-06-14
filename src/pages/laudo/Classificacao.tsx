import React from 'react'
import { useReport } from '@/context/ReportContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

export default function Classificacao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Classificação salva com sucesso.' })
    navigate(`/laudo/${id}/referencias`)
  }

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <h2 className="text-[#2b579a] font-serif font-bold text-2xl mb-8 border-b-2 border-[#2b579a] pb-2">
        12. Classificação Técnica
      </h2>
      <div className="grid gap-6 max-w-2xl">
        <div className="space-y-2">
          <Label>Tipo de Classificação</Label>
          <Select
            value={data.classificacao.tipo}
            onValueChange={(v) => updateSection('classificacao', { tipo: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Informativo">Informativo</SelectItem>
              <SelectItem value="Inspetivo">Inspetivo</SelectItem>
              <SelectItem value="Pericial">Pericial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Estado de Desempenho</Label>
          <Select
            value={data.classificacao.estadoDesempenho}
            onValueChange={(v) => updateSection('classificacao', { estadoDesempenho: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Adequado">Adequado</SelectItem>
              <SelectItem value="Inadequado">Inadequado</SelectItem>
              <SelectItem value="Crítico">Crítico</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Prioridade</Label>
          <Select
            value={data.classificacao.prioridade}
            onValueChange={(v) => updateSection('classificacao', { prioridade: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixa">Baixa</SelectItem>
              <SelectItem value="Média">Média</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
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
