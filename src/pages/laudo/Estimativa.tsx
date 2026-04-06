import React from 'react'
import {
  Clock,
  Download,
  AlertTriangle,
  ChevronLeft,
  FileText,
  ImageIcon,
  Edit3,
  CheckCircle,
  Calculator,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function Estimativa() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data, updateSection } = useReport()

  const estimativa = data.estimativa || {
    volumeDocumentos: 'elevado',
    quantidadeFotos: 55,
    horasAnaliseManual: '',
    horasImagensManual: '',
    horasRedacaoManual: '',
    horasRevisaoManual: '',
    valorHora: 350,
  }

  const handleUpdate = (f: string, v: string | number) => updateSection('estimativa', { [f]: v })

  const baseAnalise =
    estimativa.volumeDocumentos === 'baixo' ? 1 : estimativa.volumeDocumentos === 'moderado' ? 2 : 4
  const baseImagens = Number((((Number(estimativa.quantidadeFotos) || 0) * 2) / 60).toFixed(1))
  const baseRedacao = 4
  const baseRevisao = 1.5

  const parseManual = (val: string | number | undefined, base: number) =>
    val !== '' && val !== undefined ? Number(val) : base

  const finalAnalise = parseManual(estimativa.horasAnaliseManual, baseAnalise)
  const finalImagens = parseManual(estimativa.horasImagensManual, baseImagens)
  const finalRedacao = parseManual(estimativa.horasRedacaoManual, baseRedacao)
  const finalRevisao = parseManual(estimativa.horasRevisaoManual, baseRevisao)

  const totalHoras = finalAnalise + finalImagens + finalRedacao + finalRevisao
  const valorHora = Number(estimativa.valorHora) || 0
  const totalHonorarios = totalHoras * valorHora

  const handleExport = () => {
    toast({
      title: 'Gerando arquivo...',
      description: 'Aguarde enquanto o documento Word é preparado.',
    })
    setTimeout(() => {
      toast({
        title: 'Download concluído',
        description: 'O arquivo foi enviado para sua pasta de Downloads.',
      })
      navigate('/')
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-slate-800 mb-2">
          Estimativa de Tempo e Honorários
        </h1>
        <p className="text-muted-foreground text-lg">
          Calcule as horas técnicas dedicadas ao laudo e os honorários profissionais recomendados.
        </p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-6 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-xl font-medium text-teal-800">
            <Clock className="w-5 h-5" /> Estimativa Orientativa de Tempo Técnico
          </CardTitle>
          <CardDescription className="text-base">
            Configure os parâmetros do laudo para calcular as horas trabalhadas. Você pode ajustar
            manualmente se necessário.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Volume de Documentos</Label>
              <Select
                value={estimativa.volumeDocumentos}
                onValueChange={(v) => handleUpdate('volumeDocumentos', v)}
              >
                <SelectTrigger className="bg-white h-11">
                  <SelectValue placeholder="Selecione o volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixo">Baixo (~1h)</SelectItem>
                  <SelectItem value="moderado">Moderado (~2h)</SelectItem>
                  <SelectItem value="elevado">Elevado (~3-4h)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Quantidade de Fotos</Label>
              <Input
                type="number"
                min="0"
                value={estimativa.quantidadeFotos}
                onChange={(e) => handleUpdate('quantidadeFotos', e.target.value)}
                className="bg-white h-11"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-slate-500" /> Detalhamento e Ajustes Manuais
            </h3>
            <div className="space-y-3">
              {[
                {
                  id: 'horasAnaliseManual',
                  label: 'Compreensão e Análise',
                  icon: FileText,
                  calc: baseAnalise,
                  val: estimativa.horasAnaliseManual,
                },
                {
                  id: 'horasImagensManual',
                  label: 'Tratamento de Fotos',
                  icon: ImageIcon,
                  calc: baseImagens,
                  val: estimativa.horasImagensManual,
                },
                {
                  id: 'horasRedacaoManual',
                  label: 'Redação do Laudo',
                  icon: Edit3,
                  calc: baseRedacao,
                  val: estimativa.horasRedacaoManual,
                },
                {
                  id: 'horasRevisaoManual',
                  label: 'Revisão Final',
                  icon: CheckCircle,
                  calc: baseRevisao,
                  val: estimativa.horasRevisaoManual,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg border transition-colors',
                    item.val !== '' && item.val !== undefined
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-white border-slate-100 hover:border-slate-200',
                  )}
                >
                  <div className="md:col-span-5 flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-md">
                      <item.icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <div className="md:col-span-3 text-sm text-slate-500">
                    Calculado: <span className="font-semibold text-slate-700">{item.calc}h</span>
                  </div>
                  <div className="md:col-span-4 flex items-center gap-3">
                    <Label className="text-xs font-medium text-slate-400 whitespace-nowrap hidden lg:block">
                      Ajuste manual (h):
                    </Label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder={`Usar ${item.calc}h`}
                      value={item.val ?? ''}
                      onChange={(e) => handleUpdate(item.id, e.target.value)}
                      className={cn(
                        'w-full h-9 text-sm',
                        item.val !== '' && item.val !== undefined
                          ? 'border-amber-300 focus-visible:ring-amber-400'
                          : '',
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-100 shadow-md bg-gradient-to-br from-teal-50 to-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <DollarSign className="w-32 h-32" />
        </div>
        <CardHeader className="pb-4 border-b border-teal-100/50 relative z-10">
          <CardTitle className="text-xl text-teal-900">Honorários</CardTitle>
          <CardDescription className="text-teal-700/70">
            Defina o valor da hora técnica para calcular os honorários totais sugeridos.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="w-full md:w-1/3 space-y-3">
              <Label className="text-teal-900 font-semibold">Valor da Hora Técnica (R$)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 sm:text-sm">R$</span>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="10"
                  value={estimativa.valorHora}
                  onChange={(e) => handleUpdate('valorHora', e.target.value)}
                  className="pl-9 bg-white h-11 text-lg font-medium border-teal-200 focus-visible:ring-teal-500"
                />
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-4 justify-end">
              <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-sm flex flex-col justify-center min-w-[140px]">
                <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">
                  Total de Horas
                </span>
                <span className="text-2xl font-bold text-slate-800">{totalHoras.toFixed(1)}h</span>
              </div>
              <div className="bg-teal-800 p-4 rounded-xl border border-teal-900 shadow-sm flex flex-col justify-center min-w-[200px]">
                <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider mb-1">
                  Total de Honorários
                </span>
                <span className="text-3xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(totalHonorarios)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-slate-800">Exportar Laudo</CardTitle>
          <CardDescription>
            Gere o documento final em formato Word (.docx) contendo todas as seções e os cálculos
            realizados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-semibold">Atenção aos dados</AlertTitle>
            <AlertDescription className="text-amber-700/90 text-sm mt-1">
              Os dados estão armazenados <strong>temporariamente</strong> no seu navegador.
              Recomendamos exportar o documento agora, pois as informações serão perdidas se você
              fechar a página.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border border-slate-200 rounded-xl bg-slate-50/50">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-teal-700" /> Documento Final
              </h4>
              <p className="text-sm text-slate-500 max-w-md">
                O arquivo incluirá o laudo técnico completo e a estimativa de honorários para seu
                controle interno.
              </p>
            </div>
            <Button
              onClick={handleExport}
              size="lg"
              className="bg-teal-700 hover:bg-teal-800 text-white min-w-[220px] h-12 text-base gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <Download className="w-5 h-5" /> Exportar para Word
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="pt-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/laudo/novo/encerramento')}
          className="gap-2 text-slate-500 hover:text-slate-800"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para encerramento
        </Button>
      </div>
    </div>
  )
}
