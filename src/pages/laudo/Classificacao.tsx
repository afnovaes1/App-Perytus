import React from 'react'
import { Info, Calculator } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useReport } from '@/context/ReportContext'
import { cn } from '@/lib/utils'

const CLASSES_DESEMPENHO = [
  { value: '1', label: 'Classe 1', desc: 'Desempenho adequado' },
  { value: '2', label: 'Classe 2', desc: 'Desempenho regular' },
  { value: '3', label: 'Classe 3', desc: 'Desempenho inadequado' },
]

const PRIORIDADES = [
  { value: '1', label: 'Prioridade 1', desc: 'Intervenção imediata' },
  { value: '2', label: 'Prioridade 2', desc: 'Intervenção a curto prazo' },
  { value: '3', label: 'Prioridade 3', desc: 'Intervenção a médio/longo prazo' },
]

export default function Classificacao() {
  const { data, updateSection } = useReport()
  const { classificacao } = data

  const getGUTScore = () => {
    const g = Number(classificacao.matrizGUT.gravidade) || 0
    const u = Number(classificacao.matrizGUT.urgencia) || 0
    const t = Number(classificacao.matrizGUT.tendencia) || 0
    if (g && u && t) return g * u * t
    return 0
  }

  const score = getGUTScore()

  const getBadgeStyle = (val: number) => {
    if (!val) return 'bg-gray-100 text-gray-500'
    if (val <= 10) return 'bg-green-100 text-green-800 border-green-200'
    if (val <= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (val <= 75) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getBadgeLabel = (val: number) => {
    if (!val) return 'Pendente'
    if (val <= 10) return 'Baixa'
    if (val <= 40) return 'Moderada'
    if (val <= 75) return 'Alta'
    return 'Crítica'
  }

  const handleEstadoChange = (key: string, value: string) => {
    updateSection('classificacao', {
      estadoDesempenho: { ...classificacao.estadoDesempenho, [key]: value },
    })
  }

  const handlePrioridadeChange = (key: string, value: string) => {
    updateSection('classificacao', {
      prioridade: { ...classificacao.prioridade, [key]: value },
    })
  }

  const handleGUTChange = (key: string, value: string) => {
    const num = value ? parseInt(value) : ''
    updateSection('classificacao', {
      matrizGUT: { ...classificacao.matrizGUT, [key]: num },
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h2 className="text-2xl font-serif font-semibold text-primary mb-1">
          Núcleo de Classificação Metodológica
        </h2>
        <p className="text-muted-foreground">
          Classificação técnica do estado, prioridade e criticidade
        </p>
      </div>

      <div className="w-full h-px bg-border my-6"></div>

      {/* A - Estado Aparente de Desempenho */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            A
          </div>
          <CardTitle className="text-base">Estado Aparente de Desempenho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground flex items-center gap-1">
              Classificação do estado <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={classificacao.estadoDesempenho.classe}
              onValueChange={(val) => handleEstadoChange('classe', val)}
              className="space-y-2"
            >
              {CLASSES_DESEMPENHO.map((item) => (
                <div
                  key={item.value}
                  className={cn(
                    'flex items-center space-x-3 border rounded-md p-3 transition-colors',
                    classificacao.estadoDesempenho.classe === item.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-slate-50',
                  )}
                >
                  <RadioGroupItem value={item.value} id={`classe-${item.value}`} />
                  <Label htmlFor={`classe-${item.value}`} className="flex-1 cursor-pointer">
                    <span className="font-semibold">{item.label}</span>{' '}
                    <span className="text-muted-foreground font-normal">— {item.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="flex items-center gap-1">
              Justificativa técnica da classificação <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Descreva a justificativa técnica para a classificação de desempenho atribuída..."
              value={classificacao.estadoDesempenho.justificativa}
              onChange={(e) => handleEstadoChange('justificativa', e.target.value)}
              className="min-h-[100px] resize-y"
            />
          </div>
        </CardContent>
      </Card>

      {/* B - Classificação de Prioridade */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            B
          </div>
          <CardTitle className="text-base">Classificação de Prioridade (NBR 16747)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground flex items-center gap-1">
              Grau de prioridade <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={classificacao.prioridade.grau}
              onValueChange={(val) => handlePrioridadeChange('grau', val)}
              className="space-y-2"
            >
              {PRIORIDADES.map((item) => (
                <div
                  key={item.value}
                  className={cn(
                    'flex items-center space-x-3 border rounded-md p-3 transition-colors',
                    classificacao.prioridade.grau === item.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-slate-50',
                  )}
                >
                  <RadioGroupItem value={item.value} id={`prioridade-${item.value}`} />
                  <Label htmlFor={`prioridade-${item.value}`} className="flex-1 cursor-pointer">
                    <span className="font-semibold">{item.label}</span>{' '}
                    <span className="text-muted-foreground font-normal">— {item.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="flex items-center gap-1">
              Fundamentação técnica da priorização <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Descreva a fundamentação técnica para o grau de prioridade atribuído..."
              value={classificacao.prioridade.fundamentacao}
              onChange={(e) => handlePrioridadeChange('fundamentacao', e.target.value)}
              className="min-h-[100px] resize-y"
            />
          </div>
        </CardContent>
      </Card>

      {/* C - Matriz GUT */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            C
          </div>
          <CardTitle className="text-base">Matriz GUT (Gravidade × Urgência × Tendência)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3 flex gap-3 text-sm">
            <Info className="h-5 w-5 shrink-0" />
            <p>
              As classificações apresentadas possuem caráter metodológico orientativo. A atribuição
              dos critérios e sua interpretação são de exclusiva responsabilidade do profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Gravidade (G) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                max="5"
                placeholder="1 a 5"
                value={classificacao.matrizGUT.gravidade}
                onChange={(e) => handleGUTChange('gravidade', e.target.value)}
                className="text-center"
              />
              <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider">
                Impacto se não resolvido
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Urgência (U) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                max="5"
                placeholder="1 a 5"
                value={classificacao.matrizGUT.urgencia}
                onChange={(e) => handleGUTChange('urgencia', e.target.value)}
                className="text-center"
              />
              <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider">
                Prazo para ação
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Tendência (T) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                max="5"
                placeholder="1 a 5"
                value={classificacao.matrizGUT.tendencia}
                onChange={(e) => handleGUTChange('tendencia', e.target.value)}
                className="text-center"
              />
              <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider">
                Evolução provável
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">
                  Índice de Importância (G × U × T)
                </p>
                <p className="text-3xl font-bold text-foreground">{score || '-'}</p>
              </div>
            </div>
            {score > 0 && (
              <div
                className={cn(
                  'px-4 py-1.5 rounded-full border text-sm font-semibold shadow-sm',
                  getBadgeStyle(score),
                )}
              >
                {getBadgeLabel(score)}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Faixas de classificação:</Label>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> 1-10: Baixa
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div> 11-40: Moderada
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div> 41-75: Alta
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> 76-125: Crítica
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="flex items-center gap-1">
              Justificativa técnica dos fatores atribuídos{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Descreva a justificativa técnica para os valores de Gravidade, Urgência e Tendência atribuídos..."
              value={classificacao.matrizGUT.justificativa}
              onChange={(e) => {
                updateSection('classificacao', {
                  matrizGUT: { ...classificacao.matrizGUT, justificativa: e.target.value },
                })
              }}
              className="min-h-[100px] resize-y"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
