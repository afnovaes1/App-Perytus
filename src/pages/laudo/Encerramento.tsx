import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Encerramento() {
  const { id } = useParams()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Encerramento salvo.' })
    navigate(`/laudo/${id}/anexos`)
  }

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-6 border-b-2 border-[#2b579a] pb-2">
        <h2 className="text-[#2b579a] font-serif font-bold text-2xl">10. Encerramento</h2>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-slate-500 italic mb-2">
          Seção destinada à complementação pelo profissional.
        </p>
        <Textarea
          value={data.encerramento.texto}
          onChange={(e) => updateSection('encerramento', { texto: e.target.value })}
          placeholder="Insira as considerações finais..."
          className="min-h-[150px]"
        />
      </div>

      <div className="flex justify-end pt-8 mt-8 border-t">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-4 w-4" /> Salvar e Continuar
        </Button>
      </div>
    </div>
  )
}
