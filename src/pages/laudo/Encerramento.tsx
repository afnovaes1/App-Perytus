import React from 'react'
import { Clock, Download, Edit2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function Encerramento() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data, updateSection } = useReport()

  const encerramento = data.encerramento || { volumeDocumentos: 'elevado', quantidadeFotos: 55 }

  const handleUpdate = (field: string, value: string | number) => {
    updateSection('encerramento', { [field]: value })
  }

  const handleExport = () => {
    toast({
      title: 'Gerando arquivo...',
      description: 'Aguarde enquanto o documento Word é preparado.',
    })
    setTimeout(() => {
      toast({
        title: 'Download iniciado',
        description: 'O arquivo foi enviado para sua pasta de Downloads.',
      })
    }, 1500)
  }

  const handleFinish = () => {
    toast({
      title: 'Laudo finalizado',
      description: 'O laudo técnico foi salvo com sucesso.',
    })
    navigate('/')
  }

  // Time calculations in minutes
  const baseCompreensao = 90
  const baseOrganizacao = 60
  const baseConsolidacao = 240

  let estudoDocumental = 120 // moderado default
  if (encerramento.volumeDocumentos === 'baixo') estudoDocumental = 60
  if (encerramento.volumeDocumentos === 'elevado') estudoDocumental = 210

  const fotos = Number(encerramento.quantidadeFotos) || 0
  const tempoImagens = fotos * 2

  const totalMinutos =
    baseCompreensao + estudoDocumental + baseOrganizacao + tempoImagens + baseConsolidacao

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = Math.floor(minutes % 60)
    if (h > 0 && m > 0) return `${h}h${m.toString().padStart(2, '0')}`
    if (h > 0) return `${h}h`
    return `${m}m`
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-2 text-xl font-medium text-teal-800">
            <Clock className="w-5 h-5" />
            Estimativa Orientativa de Tempo Técnico
          </CardTitle>
          <CardDescription className="text-base">
            Estimativa baseada no volume de informações e registros indicados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Volume de documentos analisados
            </label>
            <ToggleGroup
              type="single"
              value={encerramento.volumeDocumentos}
              onValueChange={(v) => v && handleUpdate('volumeDocumentos', v)}
              className="justify-start gap-3"
            >
              <ToggleGroupItem
                value="baixo"
                className="border bg-transparent hover:bg-muted data-[state=on]:bg-teal-800 data-[state=on]:text-white data-[state=on]:border-teal-800 transition-colors px-4 py-2 h-auto"
              >
                Baixo (~1h)
              </ToggleGroupItem>
              <ToggleGroupItem
                value="moderado"
                className="border bg-transparent hover:bg-muted data-[state=on]:bg-teal-800 data-[state=on]:text-white data-[state=on]:border-teal-800 transition-colors px-4 py-2 h-auto"
              >
                Moderado (~2h)
              </ToggleGroupItem>
              <ToggleGroupItem
                value="elevado"
                className="border bg-transparent hover:bg-muted data-[state=on]:bg-teal-800 data-[state=on]:text-white data-[state=on]:border-teal-800 transition-colors px-4 py-2 h-auto"
              >
                Elevado (~3-4h)
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2 max-w-xs">
            <label className="text-sm font-medium text-foreground">
              Quantidade aproximada de fotos utilizadas
            </label>
            <Input
              type="number"
              min="0"
              value={encerramento.quantidadeFotos}
              onChange={(e) =>
                handleUpdate('quantidadeFotos', e.target.value ? Number(e.target.value) : '')
              }
              className="bg-white"
            />
            <p className="text-xs text-muted-foreground">
              Considera ~2 min por foto para tratamento e inserção
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/60">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Compreensão inicial do caso</span>
              <span className="font-medium">{formatTime(baseCompreensao)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estudo documental</span>
              <span className="font-medium">{formatTime(estudoDocumental)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Organização técnica e formulação de hipóteses
              </span>
              <span className="font-medium">{formatTime(baseOrganizacao)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tratamento e inserção de imagens</span>
              <span className="font-medium">{formatTime(tempoImagens)}</span>
            </div>
            <div className="flex justify-between text-sm pb-2">
              <span className="text-muted-foreground">Consolidação e redação do documento</span>
              <span className="font-medium">{formatTime(baseConsolidacao)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg pt-4 border-t border-border/60 text-teal-800">
              <span>Total estimado</span>
              <span>{formatTime(totalMinutos)}</span>
            </div>
          </div>

          <div>
            <Button
              variant="ghost"
              className="text-teal-800 -ml-3 hover:text-teal-900 hover:bg-teal-50"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Ajustar estimativa manualmente
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Exportar Documento</h3>
              <p className="text-sm text-muted-foreground">
                Gere o arquivo Word estruturado para finalização
              </p>
            </div>
            <Button
              onClick={handleExport}
              className="bg-teal-800 hover:bg-teal-900 text-white w-full md:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Word
            </Button>
          </div>

          <div className="space-y-3 mt-6 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-base leading-none select-none">💡</span>
              <p>
                O arquivo será baixado para sua pasta de{' '}
                <strong className="font-medium text-foreground">Downloads</strong>.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-base leading-none select-none">⚠️</span>
              <p>
                Se o download não iniciar: verifique o{' '}
                <strong className="font-medium text-foreground">bloqueador de pop-ups</strong> do
                navegador ou pressione{' '}
                <strong className="font-medium text-foreground">Ctrl+J</strong> para ver downloads.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-8 pb-12 space-y-8">
        <p className="text-sm text-muted-foreground italic text-center">
          A redação final é responsabilidade do profissional. O PERYTUS é seu parceiro técnico na
          organização do raciocínio.
        </p>
        <div className="flex justify-between items-center w-full pt-4">
          <Button variant="outline" onClick={() => navigate('/laudo/novo/classificacao')}>
            Revisar anterior
          </Button>
          <Button onClick={handleFinish} className="bg-teal-800 hover:bg-teal-900 text-white px-8">
            Salvar encerramento
          </Button>
        </div>
      </div>
    </div>
  )
}
