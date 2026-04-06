import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const PROCEDIMENTOS = [
  'Vistoria visual',
  'Registro fotográfico',
  'Análise documental',
  'Medições simples',
  'Relatos de usuários/responsáveis',
]
const LIMITACOES = [
  'Áreas inacessíveis',
  'Ausência de projetos',
  'Impossibilidade de ensaios',
  'Limitações temporais',
  'Impossibilidade de monitoramento prolongado',
]

export default function Metodologia() {
  const { id } = useParams()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Metodologia salva.' })
    navigate(`/laudo/${id}/estimativa`)
  }

  const toggleArray = (
    field: 'procedimentosAdotados' | 'limitacoesInvestigacao',
    value: string,
  ) => {
    const current = data.metodologia[field] || []
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    updateSection('metodologia', { [field]: next })
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
        <div className="mb-6 border-b-2 border-[#2b579a] pb-2">
          <h2 className="text-[#2b579a] font-serif font-bold text-2xl">
            6. Metodologia da Investigação e Limitações da Análise
          </h2>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-[#2b579a] font-bold text-lg mb-4">6.1 Procedimentos Adotados</h3>
            <div className="space-y-3 pl-2">
              {PROCEDIMENTOS.map((item) => (
                <div key={item} className="flex items-center space-x-3">
                  <Checkbox
                    id={`proc-${item}`}
                    checked={data.metodologia.procedimentosAdotados.includes(item)}
                    onCheckedChange={() => toggleArray('procedimentosAdotados', item)}
                  />
                  <Label
                    htmlFor={`proc-${item}`}
                    className="font-normal cursor-pointer text-sm leading-none"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#2b579a] font-bold text-lg mb-4">
              6.2 Limitações da Investigação
            </h3>
            <div className="space-y-3 pl-2">
              {LIMITACOES.map((item) => (
                <div key={item} className="flex items-center space-x-3">
                  <Checkbox
                    id={`lim-${item}`}
                    checked={data.metodologia.limitacoesInvestigacao.includes(item)}
                    onCheckedChange={() => toggleArray('limitacoesInvestigacao', item)}
                  />
                  <Label
                    htmlFor={`lim-${item}`}
                    className="font-normal cursor-pointer text-sm leading-none"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#2b579a] font-bold text-lg mb-2">6.3 Alcance Interpretativo</h3>
            <Textarea
              value={data.metodologia.alcanceInterpretativo}
              onChange={(e) =>
                updateSection('metodologia', { alcanceInterpretativo: e.target.value })
              }
              placeholder="As conclusões são medianamente confiáveis..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
        <div className="mb-4 border-b-2 border-[#2b579a] pb-2">
          <h2 className="text-[#2b579a] font-serif font-bold text-2xl">
            7. Observação sobre Amplitude Técnica
          </h2>
        </div>
        <Textarea
          value={data.metodologia.amplitudeTecnica}
          onChange={(e) => updateSection('metodologia', { amplitudeTecnica: e.target.value })}
          placeholder="A análise apresenta indícios de abordagem multidisciplinar..."
          className="min-h-[100px]"
        />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
        <div className="mb-4 border-b-2 border-[#2b579a] pb-2">
          <h2 className="text-[#2b579a] font-serif font-bold text-2xl">8. Lacunas Metodológicas</h2>
        </div>
        <Textarea
          value={data.metodologia.lacunasMetodologicas}
          onChange={(e) => updateSection('metodologia', { lacunasMetodologicas: e.target.value })}
          placeholder="Considerar hipóteses alternativas para maior robustez..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-4 w-4" /> Salvar e Continuar
        </Button>
      </div>
    </div>
  )
}
