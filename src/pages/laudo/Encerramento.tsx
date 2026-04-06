import React from 'react'
import {
  Clock,
  Download,
  AlertTriangle,
  Save,
  ChevronLeft,
  FileText,
  ImageIcon,
  Edit3,
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

export default function Encerramento() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data, updateSection } = useReport()

  const encerramento = data.encerramento || {
    volumeDocumentos: 'elevado',
    quantidadeFotos: 55,
    horasAnaliseManual: '',
    horasImagensManual: '',
    horasRedacaoManual: '',
  }

  const handleUpdate = (f: string, v: string | number) => updateSection('encerramento', { [f]: v })

  const baseAnalise =
    encerramento.volumeDocumentos === 'baixo'
      ? 1
      : encerramento.volumeDocumentos === 'moderado'
        ? 2
        : 4
  const baseImagens = Number((((Number(encerramento.quantidadeFotos) || 0) * 2) / 60).toFixed(1))
  const baseRedacao = 4

  const parseManual = (val: string | number | undefined, base: number) =>
    val !== '' && val !== undefined ? Number(val) : base
  const finalAnalise = parseManual(encerramento.horasAnaliseManual, baseAnalise)
  const finalImagens = parseManual(encerramento.horasImagensManual, baseImagens)
  const finalRedacao = parseManual(encerramento.horasRedacaoManual, baseRedacao)

  const totalHoras = finalAnalise + finalImagens + finalRedacao

  const handleExport = () => {
    toast({
      title: 'Gerando arquivo...',
      description: 'Aguarde enquanto o documento Word é preparado.',
    })
    setTimeout(
      () =>
        toast({
          title: 'Download iniciado',
          description: 'O arquivo foi enviado para sua pasta de Downloads.',
        }),
      1500,
    )
  }

  const handleFinish = () => {
    toast({ title: 'Laudo finalizado', description: 'O laudo técnico foi salvo com sucesso.' })
    navigate('/')
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-slate-800 mb-2">Encerramento e Exportação</h1>
        <p className="text-muted-foreground text-lg">
          Estime o tempo técnico dedicado e gere o documento final
        </p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-6 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-xl font-medium text-teal-800">
            <Clock className="w-5 h-5" /> Estimativa Orientativa de Tempo Técnico
          </CardTitle>
          <CardDescription className="text-base">
            Configure os parâmetros do laudo para calcular as horas trabalhadas, ou ajuste
            manualmente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="space-y-2">
              <Label className="text-slate-700">Volume de Documentos</Label>
              <Select
                value={encerramento.volumeDocumentos}
                onValueChange={(v) => handleUpdate('volumeDocumentos', v)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione o volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixo">Baixo (~1h)</SelectItem>
                  <SelectItem value="moderado">Moderado (~2h)</SelectItem>
                  <SelectItem value="elevado">Elevado (~3-4h)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">Quantidade de Fotos</Label>
              <Input
                type="number"
                min="0"
                value={encerramento.quantidadeFotos}
                onChange={(e) => handleUpdate('quantidadeFotos', e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-slate-800 mb-4">Detalhamento de Horas</h3>
            <div className="space-y-3">
              {[
                {
                  id: 'horasAnaliseManual',
                  label: 'Análise de Documentos',
                  icon: FileText,
                  calc: baseAnalise,
                  val: encerramento.horasAnaliseManual,
                },
                {
                  id: 'horasImagensManual',
                  label: 'Tratamento de Imagens',
                  icon: ImageIcon,
                  calc: baseImagens,
                  val: encerramento.horasImagensManual,
                },
                {
                  id: 'horasRedacaoManual',
                  label: 'Redação e Consolidação',
                  icon: Edit3,
                  calc: baseRedacao,
                  val: encerramento.horasRedacaoManual,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-3 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <div className="md:col-span-5 flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <div className="md:col-span-3 text-sm text-slate-500">
                    Calc: <span className="font-medium">{item.calc}h</span>
                  </div>
                  <div className="md:col-span-4 flex items-center gap-2">
                    <Label className="text-xs text-slate-400 whitespace-nowrap hidden md:block">
                      Ajuste manual (h):
                    </Label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder={`${item.calc}`}
                      value={item.val ?? ''}
                      onChange={(e) => handleUpdate(item.id, e.target.value)}
                      className="w-full h-8 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-teal-50 border border-teal-100 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="font-semibold text-teal-900 text-lg">Total de Horas Estimadas</span>
              <span className="font-bold text-teal-700 text-3xl">{totalHoras.toFixed(1)}h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-slate-800">Exportar Laudo</CardTitle>
          <CardDescription>
            Gere o documento final em formato Word (.docx) para revisão, adição de assinatura e
            formatação final.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-semibold">Atenção aos dados</AlertTitle>
            <AlertDescription className="text-amber-700/90 text-sm mt-1">
              Os dados inseridos no laudo estão armazenados <strong>temporariamente</strong> no seu
              navegador. Ao fechar ou atualizar a página, as informações poderão ser perdidas, uma
              vez que o sistema ainda não está conectado a um banco de dados em nuvem. Recomendamos
              exportar o documento antes de sair.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border border-slate-200 rounded-lg bg-slate-50/50">
            <div className="space-y-1">
              <h4 className="font-medium text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" /> Documento Estruturado
              </h4>
              <p className="text-sm text-slate-500">
                O arquivo incluirá todas as seções preenchidas, prontas para edição final.
              </p>
            </div>
            <Button
              onClick={handleExport}
              className="bg-teal-800 hover:bg-teal-900 text-white min-w-[200px] h-11"
            >
              <Download className="w-4 h-4 mr-2" /> Exportar para Word
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="pt-8 space-y-6 border-t border-slate-200">
        <p className="text-sm text-muted-foreground italic text-center max-w-2xl mx-auto">
          A redação final e as conclusões apresentadas são de inteira responsabilidade do
          profissional signatário. O sistema atua apenas como ferramenta de apoio à estruturação e
          organização do raciocínio técnico.
        </p>
        <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/laudo/novo/classificacao')}
            className="gap-2 w-full md:w-auto h-11"
          >
            <ChevronLeft className="w-4 h-4" /> Revisar classificação
          </Button>
          <Button
            onClick={handleFinish}
            className="bg-slate-800 hover:bg-slate-900 text-white px-8 gap-2 w-full md:w-auto h-11"
          >
            <Save className="w-4 h-4" /> Salvar encerramento
          </Button>
        </div>
      </div>
    </div>
  )
}
