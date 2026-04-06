import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Metodologia() {
  const { data, updateSection } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleFinish = () => {
    toast({
      title: 'Laudo Finalizado!',
      description: 'Todos os dados foram registrados com sucesso.',
    })
    // In a real app, this would send data to backend. For now, navigate to dashboard.
    navigate('/')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">Metodologia e Normas</h1>
        <p className="text-muted-foreground text-lg">
          Referencial técnico utilizado durante a elaboração do laudo.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-border space-y-4">
        <Label className="text-lg">Normas Técnicas (NBRs) e Equipamentos</Label>
        <Textarea
          placeholder="Ex: A vistoria foi baseada na NBR 13752. Equipamentos utilizados: fissurômetro digital, trena a laser..."
          className="min-h-[250px]"
          value={data.metodologia.normas}
          onChange={(e) => updateSection('metodologia', { normas: e.target.value })}
        />
      </div>

      <div className="flex justify-end pt-8">
        <Button onClick={handleFinish} className="gap-2 bg-green-700 hover:bg-green-800" size="lg">
          <CheckCircle className="h-5 w-5" />
          Finalizar Laudo
        </Button>
      </div>
    </div>
  )
}
