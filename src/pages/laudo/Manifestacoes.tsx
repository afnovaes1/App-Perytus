import React from 'react'
import { useReport, Manifestacao } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Manifestacoes() {
  const { id } = useParams()
  const { data, setManifestacoes, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleAdd = () => {
    const newItem: Manifestacao = {
      id: Math.random().toString(36).substring(2, 9),
      titulo: '',
      localizacao: '',
      intensidade: '',
      evolucao: '',
      observacoes: '',
    }
    setManifestacoes([...data.manifestacoes, newItem])
  }

  const handleUpdate = (itemId: string, field: keyof Manifestacao, value: string) => {
    setManifestacoes(
      data.manifestacoes.map((m) => (m.id === itemId ? { ...m, [field]: value } : m)),
    )
  }

  const handleRemove = (itemId: string) => {
    setManifestacoes(data.manifestacoes.filter((m) => m.id !== itemId))
  }

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Manifestações salvas.' })
    navigate(`/laudo/${id}/evidencias`)
  }

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <div className="flex justify-between items-center mb-8 border-b-2 border-[#2b579a] pb-2">
        <h2 className="text-[#2b579a] font-serif font-bold text-2xl">
          2. Manifestações Observadas
        </h2>
        <Button onClick={handleAdd} size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Nova Manifestação
        </Button>
      </div>

      {data.manifestacoes.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <p className="text-muted-foreground mb-4">Nenhuma manifestação registrada.</p>
          <Button onClick={handleAdd}>Adicionar a primeira</Button>
        </div>
      ) : (
        <div className="space-y-12">
          {data.manifestacoes.map((item, index) => (
            <div key={item.id} className="relative group">
              <h3 className="text-[#2b579a] font-bold text-lg mb-4 flex items-center gap-2">
                2.{index + 1}
                <Input
                  value={item.titulo}
                  onChange={(e) => handleUpdate(item.id, 'titulo', e.target.value)}
                  placeholder="Título da manifestação (ex: trinca na parede em 45 graus)"
                  className="font-bold text-lg h-9 border-transparent focus-visible:border-input bg-transparent hover:bg-slate-50"
                />
              </h3>

              <div className="grid gap-3 text-sm ml-6 mb-6">
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <Label className="font-semibold text-slate-700">Localização:</Label>
                  <Input
                    value={item.localizacao}
                    onChange={(e) => handleUpdate(item.id, 'localizacao', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <Label className="font-semibold text-slate-700">Intensidade:</Label>
                  <Input
                    value={item.intensidade}
                    onChange={(e) => handleUpdate(item.id, 'intensidade', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <Label className="font-semibold text-slate-700">Evolução temporal:</Label>
                  <Input
                    value={item.evolucao}
                    onChange={(e) => handleUpdate(item.id, 'evolucao', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-start gap-2">
                  <Label className="font-semibold text-slate-700 mt-2">Observações:</Label>
                  <Textarea
                    value={item.observacoes}
                    onChange={(e) => handleUpdate(item.id, 'observacoes', e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
              </div>

              <div className="ml-6 mb-4">
                <div className="border-2 border-dashed border-slate-300 rounded-t-lg bg-slate-50 min-h-[250px] flex flex-col items-center justify-center text-slate-400 relative">
                  <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                  <span className="italic text-sm">[Inserir foto aqui na versão final]</span>
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold border rounded shadow-sm">
                    Foto {index + 1}
                  </div>
                </div>
                <div className="bg-blue-50/50 p-2 text-xs text-[#2b579a] text-center border-x border-b border-slate-300 rounded-b-lg font-medium">
                  Manifestação {index + 1} – {item.titulo || 'sem título'} –{' '}
                  {item.localizacao || 'sem localização'}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(item.id)}
                className="absolute -left-2 top-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-8 mt-8 border-t">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-4 w-4" /> Salvar e Continuar
        </Button>
      </div>
    </div>
  )
}
