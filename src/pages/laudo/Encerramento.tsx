import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Save, FileDown } from 'lucide-react'
import { exportToWord } from '@/lib/word-export'
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

  const handleExport = async () => {
    // Save first to ensure latest data is exported
    await saveReport()

    // Construct a temporary report object since we might not have the full record in context
    const reportToExport = {
      title: data.identificacao?.sintese?.substring(0, 30) || 'Laudo_Tecnico',
      created: new Date().toISOString(),
      data,
    }

    exportToWord(reportToExport)
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

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t">
        <Button
          variant="outline"
          onClick={handleExport}
          className="gap-2 w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50"
          size="lg"
        >
          <FileDown className="h-5 w-5" /> Exportar para Word
        </Button>
        <Button onClick={handleSave} className="gap-2 w-full sm:w-auto" size="lg">
          <Save className="h-4 w-4" /> Salvar e Continuar
        </Button>
      </div>
    </div>
  )
}
