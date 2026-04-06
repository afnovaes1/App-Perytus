import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Hipoteses() {
  const { data, updateSection } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = () => {
    toast({
      title: 'Sucesso',
      description: 'Hipóteses salvas com sucesso.',
    })
    navigate('/laudo/novo/consolidacao')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">Hipóteses Causais</h1>
        <p className="text-muted-foreground text-lg">
          Descreva as teorias técnicas sobre as causas das manifestações patológicas encontradas.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
        <Textarea
          placeholder="Descreva as hipóteses aqui. Ex: A trinca em 45 graus na parede da sala de estar sugere recalque diferencial da fundação, possivelmente agravado por..."
          className="min-h-[400px] text-base leading-relaxed p-4"
          value={data.hipoteses.texto}
          onChange={(e) => updateSection('hipoteses', { texto: e.target.value })}
        />
      </div>

      <div className="flex justify-end pt-8">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-4 w-4" />
          Salvar hipóteses
        </Button>
      </div>
    </div>
  )
}
