import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Paperclip, Camera, FilePlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'

const ANEXO_TYPES = [
  'Registros fotográficos',
  'Projetos',
  'Relatórios técnicos anteriores',
  'Documentos fornecidos pelo cliente',
  'Vídeos',
  'Sondagens / Ensaios',
  'Medições / Monitoramentos',
  'Outros',
]

const ORG_OPTIONS = ['Por manifestação', 'Por ambiente', 'Cronológica']

export default function Anexos() {
  const { data, updateSection } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleTipoChange = (tipo: string, checked: boolean) => {
    const current = data.anexos.tipos
    const updated = checked ? [...current, tipo] : current.filter((t) => t !== tipo)
    updateSection('anexos', { tipos: updated })
  }

  const handleSave = () => {
    toast({
      title: 'Anexos salvos',
      description: 'As informações dos anexos foram registradas com sucesso.',
    })
    navigate('/laudo/novo/classificacao')
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-serif font-semibold text-primary mb-1">
          Documentos e Anexos Complementares
        </h2>
        <p className="text-muted-foreground">
          Registre e organize os anexos que compõem o conjunto documental do laudo
        </p>
      </div>

      <div className="bg-muted/50 border rounded-lg p-4 flex gap-3 text-sm text-muted-foreground">
        <Paperclip className="h-5 w-5 shrink-0 text-primary" />
        <p>
          <strong className="text-foreground">Esta seção não armazena arquivos.</strong> Seu
          objetivo é registrar e organizar os anexos que compõem o conjunto documental do laudo,
          facilitando a referência na exportação final.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FilePlus className="h-5 w-5 text-primary" />
            Tipos de Anexos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ANEXO_TYPES.map((tipo) => (
              <div key={tipo} className="flex items-center space-x-2">
                <Checkbox
                  id={`anexo-${tipo}`}
                  checked={data.anexos.tipos.includes(tipo)}
                  onCheckedChange={(checked) => handleTipoChange(tipo, checked as boolean)}
                />
                <Label htmlFor={`anexo-${tipo}`} className="font-normal cursor-pointer text-sm">
                  {tipo}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <Label>Descrição adicional dos anexos</Label>
            <Textarea
              placeholder="Descreva os documentos e anexos que compõem o conjunto documental..."
              value={data.anexos.descricaoAdicional}
              onChange={(e) => updateSection('anexos', { descricaoAdicional: e.target.value })}
              className="min-h-[100px] resize-y"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Relatório Fotográfico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Quantidade aproximada de fotos</Label>
              <Input
                type="number"
                value={data.anexos.relatorioFotografico.quantidade}
                onChange={(e) =>
                  updateSection('anexos', {
                    relatorioFotografico: {
                      ...data.anexos.relatorioFotografico,
                      quantidade: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Organização pretendida</Label>
              <div className="flex flex-wrap gap-2">
                {ORG_OPTIONS.map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={
                      data.anexos.relatorioFotografico.organizacao === opt ? 'default' : 'outline'
                    }
                    className="h-9"
                    onClick={() =>
                      updateSection('anexos', {
                        relatorioFotografico: {
                          ...data.anexos.relatorioFotografico,
                          organizacao: opt,
                        },
                      })
                    }
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações sobre o registro fotográfico</Label>
            <Textarea
              placeholder="Ex: sequência aleatória, mas por cômodos visitados..."
              value={data.anexos.relatorioFotografico.observacoes}
              onChange={(e) =>
                updateSection('anexos', {
                  relatorioFotografico: {
                    ...data.anexos.relatorioFotografico,
                    observacoes: e.target.value,
                  },
                })
              }
              className="min-h-[80px] resize-y"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-2">
          <div className="space-y-1">
            <Label className="text-base font-semibold">Observações sobre Anexos</Label>
            <p className="text-sm text-muted-foreground">
              Critérios de seleção, limitações de registro, necessidade de consulta a arquivos
              externos, e outras observações relevantes ao leitor do laudo.
            </p>
          </div>
          <Textarea
            placeholder="Ex: Os projetos originais não foram disponibilizados pelo cliente. As sondagens foram realizadas por empresa terceira e os resultados estão em análise..."
            value={data.anexos.observacoesGerais}
            onChange={(e) => updateSection('anexos', { observacoesGerais: e.target.value })}
            className="min-h-[100px] resize-y mt-2"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Salvar anexos
        </Button>
      </div>
    </div>
  )
}
