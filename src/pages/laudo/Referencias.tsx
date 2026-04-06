import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Save, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Referencias() {
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = async () => {
    if (!data.referencias.aceiteResponsabilidade) {
      toast({
        title: 'Atenção',
        description: 'Você deve aceitar a declaração de responsabilidade técnica para finalizar.',
        variant: 'destructive',
      })
      return
    }
    await saveReport()
    toast({ title: 'Sucesso', description: 'Laudo finalizado com sucesso!' })
    navigate('/')
  }

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
        <div className="mb-6 border-b-2 border-[#2b579a] pb-2">
          <h2 className="text-[#2b579a] font-serif font-bold text-2xl">
            13. Referências Bibliográficas
          </h2>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-500 italic mb-2">
            Seção destinada à complementação pelo profissional.
          </p>
          <Textarea
            value={data.referencias.texto}
            onChange={(e) => updateSection('referencias', { texto: e.target.value })}
            placeholder="Insira as referências normativas e bibliográficas utilizadas..."
            className="min-h-[150px]"
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
        <div className="mb-6 border-b-2 border-[#2b579a] pb-2">
          <h2 className="text-[#2b579a] font-serif font-bold text-2xl">
            14. Declaração de Responsabilidade Técnica
          </h2>
        </div>

        <p className="text-sm text-slate-800 leading-relaxed mb-8">
          O presente relatório foi elaborado com apoio da plataforma PERYTUS, ferramenta de
          organização técnica. As análises, conclusões e responsabilidade técnica são exclusivamente
          do profissional signatário.
        </p>

        <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-lg border">
          <Switch
            id="aceite"
            checked={data.referencias.aceiteResponsabilidade}
            onCheckedChange={(v) => updateSection('referencias', { aceiteResponsabilidade: v })}
          />
          <Label htmlFor="aceite" className="font-bold text-slate-700 cursor-pointer">
            Li e concordo com a declaração de responsabilidade técnica acima.
          </Label>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" className="gap-2" size="lg" onClick={() => navigate('/')}>
          Sair para o Painel
        </Button>
        <Button
          onClick={handleSave}
          className="gap-2 bg-[#2b579a] hover:bg-[#1e3e70] text-white"
          size="lg"
        >
          <Download className="h-4 w-4" /> Finalizar e Salvar Documento
        </Button>
      </div>
    </div>
  )
}
