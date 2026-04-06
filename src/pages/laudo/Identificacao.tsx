import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileText, CalendarIcon, Save } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export default function Identificacao() {
  const { data, updateSection } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = () => {
    toast({
      title: 'Sucesso',
      description: 'Identificação salva com sucesso.',
    })
    navigate('/laudo/novo/manifestacoes')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8" />
          Identificação do Documento
        </h1>
        <p className="text-muted-foreground text-lg">
          Preencha as informações básicas que identificarão o laudo técnico. Esses dados aparecerão
          no cabeçalho de todas as páginas do documento exportado.
        </p>
      </div>

      <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-border">
        <div className="space-y-2">
          <Label htmlFor="destinatario" className="text-base flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Destinatário
          </Label>
          <Textarea
            id="destinatario"
            placeholder="Ex: Condomínio Residencial Villa Verde, CNPJ 00.000.000/0001-00, representado pelo síndico Sr. João Silva"
            className="min-h-[100px] resize-y"
            value={data.identificacao.destinatario}
            onChange={(e) => updateSection('identificacao', { destinatario: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Informe o nome completo, CNPJ/CPF e representante legal (se aplicável)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="local" className="text-base flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Local da Vistoria
          </Label>
          <Textarea
            id="local"
            placeholder="Ex: Rua das Palmeiras, 123, Bloco A - Apartamento 401, Bairro Jardim Europa, São Paulo/SP, CEP 01234-567"
            className="min-h-[100px] resize-y"
            value={data.identificacao.local}
            onChange={(e) => updateSection('identificacao', { local: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Endereço completo do local onde foi realizada a vistoria técnica
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-base flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            Data da Vistoria
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[300px] justify-start text-left font-normal',
                  !data.identificacao.data && 'text-muted-foreground',
                )}
              >
                {data.identificacao.data ? (
                  format(data.identificacao.data, 'PPP', { locale: ptBR })
                ) : (
                  <span>dd/mm/aaaa</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.identificacao.data}
                onSelect={(date) => updateSection('identificacao', { data: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Data em que a vistoria técnica foi realizada
          </p>
        </div>

        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
          <strong>Código do documento:</strong> Será gerado automaticamente a partir do ID do caso e
          aparecerá no cabeçalho do documento exportado.
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} className="gap-2" size="lg">
            <Save className="h-4 w-4" />
            Salvar Identificação
          </Button>
        </div>
      </div>
    </div>
  )
}
