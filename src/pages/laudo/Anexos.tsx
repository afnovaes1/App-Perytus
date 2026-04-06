import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const TIPOS = [
  'Registros fotográficos',
  'Projetos',
  'Sondagens / Ensaios',
  'Documentos fornecidos pelo cliente',
]

export default function Anexos() {
  const { id } = useParams()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Anexos salvos.' })
    navigate(`/laudo/${id}/classificacao`)
  }

  const toggleTipo = (value: string) => {
    const current = data.anexos.tipos || []
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    updateSection('anexos', { tipos: next })
  }

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-6 border-b-2 border-[#2b579a] pb-2">
        <h2 className="text-[#2b579a] font-serif font-bold text-2xl">
          11. Documentos e Anexos Complementares
        </h2>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-[#2b579a] font-bold text-lg mb-4">11.1 Tipos de Anexos</h3>
          <div className="space-y-3 pl-2">
            {TIPOS.map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <Checkbox
                  id={`tipo-${item}`}
                  checked={data.anexos.tipos.includes(item)}
                  onCheckedChange={() => toggleTipo(item)}
                />
                <Label
                  htmlFor={`tipo-${item}`}
                  className="font-normal cursor-pointer text-sm leading-none"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[#2b579a] font-bold text-lg mb-4">11.2 Relatório Fotográfico</h3>
          <div className="space-y-4 pl-2 text-sm max-w-lg">
            <div className="grid grid-cols-[200px_1fr] items-center gap-2">
              <Label className="font-semibold text-slate-700">
                Quantidade aproximada de fotos:
              </Label>
              <Input
                type="number"
                value={data.anexos.quantidadeFotos}
                onChange={(e) =>
                  updateSection('anexos', {
                    quantidadeFotos: e.target.value ? Number(e.target.value) : '',
                  })
                }
                className="h-8"
              />
            </div>
            <div className="grid grid-cols-[200px_1fr] items-center gap-2">
              <Label className="font-semibold text-slate-700">Organização:</Label>
              <Input
                value={data.anexos.organizacaoFotos}
                onChange={(e) => updateSection('anexos', { organizacaoFotos: e.target.value })}
                placeholder="Ex: Organização por ambiente"
                className="h-8"
              />
            </div>
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
