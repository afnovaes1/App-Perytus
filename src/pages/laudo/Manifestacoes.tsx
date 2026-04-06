import React, { useState } from 'react'
import { useReport, Manifestacao } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Manifestacoes() {
  const { data, setManifestacoes } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [openItem, setOpenItem] = useState<string | undefined>(undefined)

  const handleAdd = () => {
    const newItem: Manifestacao = {
      id: Math.random().toString(36).substring(2, 9),
      titulo: '',
      localizacao: '',
      intensidade: 'Moderada',
      evolucao: '',
      observacoes: '',
    }
    setManifestacoes([...data.manifestacoes, newItem])
    setOpenItem(newItem.id)
  }

  const handleUpdate = (id: string, field: keyof Manifestacao, value: string) => {
    const updated = data.manifestacoes.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    setManifestacoes(updated)
  }

  const handleRemove = (id: string) => {
    setManifestacoes(data.manifestacoes.filter((m) => m.id !== id))
    if (openItem === id) setOpenItem(undefined)
  }

  const handleSave = () => {
    toast({
      title: 'Sucesso',
      description: `${data.manifestacoes.length} manifestações salvas.`,
    })
    navigate('/laudo/novo/evidencias')
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'Leve':
        return 'bg-slate-100 text-slate-800 border-slate-200'
      case 'Moderada':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Severa':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Crítica':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">
            Registro de Manifestações Observadas
          </h1>
          <p className="text-muted-foreground text-lg">
            Documente cada manifestação identificada com detalhes observacionais
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Manifestação
        </Button>
      </div>

      <div className="space-y-4">
        {data.manifestacoes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-muted-foreground mb-4">Nenhuma manifestação registrada ainda.</p>
            <Button variant="outline" onClick={handleAdd}>
              Adicionar a primeira
            </Button>
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            value={openItem}
            onValueChange={setOpenItem}
            className="space-y-4"
          >
            {data.manifestacoes.map((item, index) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="bg-white rounded-xl border border-border px-2 shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-4 hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <span className="text-muted-foreground font-mono text-sm">#{index + 1}</span>
                    <span className="font-medium text-base truncate max-w-[300px] sm:max-w-md">
                      {item.titulo || 'Nova manifestação (sem título)'}
                    </span>
                    <Badge variant="outline" className={getIntensityColor(item.intensidade)}>
                      {item.intensidade}
                    </Badge>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-6 pt-2 border-t space-y-6">
                  <div className="space-y-2">
                    <Label>Manifestação</Label>
                    <Input
                      placeholder="Ex: Trinca na parede em 45 graus"
                      value={item.titulo}
                      onChange={(e) => handleUpdate(item.id, 'titulo', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Localização</Label>
                    <Input
                      placeholder="Ex: Sala de estar, teto próximo à janela"
                      value={item.localizacao}
                      onChange={(e) => handleUpdate(item.id, 'localizacao', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Intensidade Percebida</Label>
                    <ToggleGroup
                      type="single"
                      value={item.intensidade}
                      onValueChange={(val) => val && handleUpdate(item.id, 'intensidade', val)}
                      className="justify-start border rounded-md p-1 bg-slate-50 flex-wrap"
                    >
                      <ToggleGroupItem
                        value="Leve"
                        className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Leve
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="Moderada"
                        className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Moderada
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="Severa"
                        className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Severa
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="Crítica"
                        className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        Crítica
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Evolução Temporal</Label>
                    <Input
                      placeholder="Ex: Evoluindo progressivamente"
                      value={item.evolucao}
                      onChange={(e) => handleUpdate(item.id, 'evolucao', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Observações Narrativas</Label>
                    <Textarea
                      placeholder="Detalhes adicionais sobre a observação..."
                      className="min-h-[100px]"
                      value={item.observacoes}
                      onChange={(e) => handleUpdate(item.id, 'observacoes', e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      <div className="flex justify-end pt-8">
        <Button
          onClick={handleSave}
          className="gap-2"
          size="lg"
          disabled={data.manifestacoes.length === 0}
        >
          <Save className="h-4 w-4" />
          Salvar manifestações
        </Button>
      </div>
    </div>
  )
}
