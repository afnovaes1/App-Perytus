import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Save, FileDown, AlertTriangle } from 'lucide-react'
import { exportToWord, validateForExport } from '@/lib/word-export'
import { useNavigate, useParams } from 'react-router-dom'
import { getReport } from '@/services/reports'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useState } from 'react'

export default function Encerramento() {
  const { id } = useParams()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isExporting, setIsExporting] = useState(false)

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Encerramento salvo.' })
    navigate(`/laudo/${id}/anexos`)
  }

  const isClassificacaoPendente = !data.classificacao?.tipo
  const isExportReady = validateForExport({ data }, true)

  const handleExport = async () => {
    if (!id) return
    setIsExporting(true)
    try {
      // Save first to ensure latest data is exported
      await saveReport()

      // Backend Verification: confirm that user is authenticated and has access to the specific record
      const reportRecord = await getReport(id)

      exportToWord(reportRecord)
    } catch (error) {
      toast({
        title: 'Erro de Autenticação',
        description:
          'Você não tem permissão para exportar este laudo ou ocorreu um erro na verificação.',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-6 border-b-2 border-[#2b579a] pb-2">
        <h2 className="text-[#2b579a] font-serif font-bold text-2xl">10. Encerramento</h2>
      </div>

      {isClassificacaoPendente && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Classificação Pendente</AlertTitle>
          <AlertDescription>
            Por favor, defina a Classificação do Documento na aba 12. Classificação antes de
            exportar.
          </AlertDescription>
        </Alert>
      )}

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

      <div className="space-y-2 mt-6">
        <h3 className="text-[#2b579a] font-bold text-lg">
          11. Declaração de Responsabilidade Técnica
        </h3>
        <p className="text-sm text-slate-500 italic mb-2">Nome do Responsável Técnico.</p>
        <div className="max-w-md">
          <Input
            value={data.encerramento.responsabilidade || ''}
            onChange={(e) => updateSection('encerramento', { responsabilidade: e.target.value })}
            placeholder="Ex: Eng. João da Silva"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t">
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={!isExportReady || isExporting}
          className="gap-2 w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50"
          size="lg"
        >
          <FileDown className="h-5 w-5" /> {isExporting ? 'Gerando arquivo...' : 'Exportar Laudo'}
        </Button>
        <Button onClick={handleSave} className="gap-2 w-full sm:w-auto" size="lg">
          <Save className="h-4 w-4" /> Salvar e Continuar
        </Button>
      </div>
    </div>
  )
}
