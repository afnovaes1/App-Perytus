import React, { useState } from 'react'
import { useReport, Hipotese } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Star, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

function HipoteseCard({
  hipotese,
  onUpdate,
  onRemove,
}: {
  hipotese: Hipotese
  onUpdate: (h: Hipotese) => void
  onRemove?: () => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  const summary =
    hipotese.descricao.trim().split('\n')[0] ||
    (hipotese.principal ? 'Nova hipótese principal' : 'Nova hipótese')

  return (
    <div className="border border-border rounded-xl shadow-sm bg-white overflow-hidden flex flex-col mb-4 transition-all">
      <div
        className={cn(
          'p-4 flex items-center justify-between cursor-pointer border-l-4 hover:bg-slate-50',
          hipotese.principal ? 'border-l-primary' : 'border-l-slate-300',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {hipotese.principal && <Star className="h-5 w-5 fill-primary text-primary" />}
          <span className="font-medium text-slate-800 line-clamp-1">{summary}</span>
          {hipotese.confianca && (
            <Badge
              variant="secondary"
              className={cn(
                'font-normal shadow-none',
                hipotese.confianca === 'alta' &&
                  'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
                hipotese.confianca === 'media' && 'bg-amber-100 text-amber-800 hover:bg-amber-100',
                hipotese.confianca === 'baixa' && 'bg-rose-100 text-rose-800 hover:bg-rose-100',
              )}
            >
              Confiança {hipotese.confianca}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 pointer-events-none">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="p-6 pt-4 border-t border-border space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Descrição da hipótese
            </Label>
            <Textarea
              value={hipotese.descricao}
              onChange={(e) => onUpdate({ ...hipotese, descricao: e.target.value })}
              className="min-h-[100px] resize-y"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Critérios de descarte
            </Label>
            <Textarea
              value={hipotese.criterios}
              onChange={(e) => onUpdate({ ...hipotese, criterios: e.target.value })}
              className="min-h-[80px] resize-y"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Grau de confiança</Label>
            <div className="flex gap-2 max-w-md">
              {(['alta', 'media', 'baixa'] as const).map((nivel) => (
                <Button
                  key={nivel}
                  type="button"
                  variant="outline"
                  onClick={() => onUpdate({ ...hipotese, confianca: nivel })}
                  className={cn(
                    'flex-1 capitalize',
                    hipotese.confianca === nivel &&
                      (nivel === 'alta'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : nivel === 'media'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'),
                  )}
                >
                  {nivel}
                </Button>
              ))}
            </div>
          </div>
          {!hipotese.principal && onRemove && (
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onRemove}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-2 h-9 px-3"
              >
                <Trash2 className="h-4 w-4" /> Remover
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Hipoteses() {
  const { data, updateSection } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const hipoteses = data.hipoteses.lista || []
  const principal = hipoteses.find((h) => h.principal) || {
    id: '1',
    descricao: '',
    criterios: '',
    confianca: '',
    principal: true,
  }
  const concorrentes = hipoteses.filter((h) => !h.principal)

  const handleUpdate = (updated: Hipotese) => {
    const newList = hipoteses.map((h) => (h.id === updated.id ? updated : h))
    if (!hipoteses.find((h) => h.id === updated.id)) newList.push(updated)
    updateSection('hipoteses', { lista: newList })
  }

  const handleRemove = (id: string) => {
    updateSection('hipoteses', { lista: hipoteses.filter((h) => h.id !== id) })
  }

  const handleAddConcorrente = () => {
    const newId = Math.random().toString(36).substr(2, 9)
    updateSection('hipoteses', {
      lista: [
        ...hipoteses,
        { id: newId, descricao: '', criterios: '', confianca: '', principal: false },
      ],
    })
  }

  const handleSave = () => {
    toast({ title: 'Sucesso', description: 'Hipóteses salvas com sucesso.' })
    navigate('/laudo/novo/consolidacao')
  }

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate-800 mb-2">Hipóteses e Descarte</h1>
        <p className="text-muted-foreground text-lg">
          Formule hipóteses explicativas e estabeleça critérios de descarte
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <h2 className="text-lg font-medium text-slate-800">Hipótese Principal</h2>
          </div>
          <HipoteseCard hipotese={principal} onUpdate={handleUpdate} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-slate-800">Hipóteses Concorrentes</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddConcorrente}
              className="gap-2 text-slate-600"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
          </div>

          {concorrentes.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-8 text-center text-sm text-muted-foreground bg-slate-50/50">
              Adicione hipóteses alternativas para uma análise mais robusta
            </div>
          ) : (
            <div className="space-y-4">
              {concorrentes.map((h) => (
                <HipoteseCard
                  key={h.id}
                  hipotese={h}
                  onUpdate={handleUpdate}
                  onRemove={() => handleRemove(h.id)}
                />
              ))}
            </div>
          )}
        </section>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="lg">
            Salvar hipóteses
          </Button>
        </div>
      </div>
    </div>
  )
}
