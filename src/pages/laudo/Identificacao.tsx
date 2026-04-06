import React from 'react'
import { useReport } from '@/context/ReportContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const TERMOS = [
  {
    termo: 'Anamnese',
    def: 'Contextualização realizada por meio de estudo do histórico do objeto da perícia.',
  },
  {
    termo: 'Anomalia',
    def: 'Irregularidade, anormalidade ou exceção à regra ou a um padrão estabelecido.',
  },
  {
    termo: 'Anomalia endógena',
    def: 'Anomalia associada ao projeto, às especificações de materiais ou à execução da obra.',
  },
  {
    termo: 'Anomalia exógena',
    def: 'Anomalia associada a fatores externos ou provocada por terceiros.',
  },
  {
    termo: 'Anomalia funcional',
    def: 'Anomalia associada ao término da vida útil, à decrepitude ou à obsolescência de sistemas ou componentes.',
  },
  { termo: 'Avaria', def: 'Estrago físico ocasionado por agente externo.' },
  { termo: 'Conformidade', def: 'Atendimento a um requisito ou padrão estabelecido.' },
  {
    termo: 'Dano',
    def: 'Prejuízo causado a outrem em decorrência da ocorrência de vícios, defeitos, avarias, deteriorações ou outras anomalias.',
  },
  {
    termo: 'Defeito',
    def: 'Anomalia ou falha relacionada à solidez e à segurança da construção, ou que represente ameaça à saúde e segurança dos usuários.',
  },
  {
    termo: 'Falha',
    def: 'Ocorrência que prejudica a utilização de um sistema ou elemento construtivo, resultando em desempenho inferior ao requerido.',
  },
  {
    termo: 'Laudo',
    def: 'Documento técnico-científico elaborado por profissional habilitado, no qual são apresentados o desenvolvimento, a análise e a conclusão de uma perícia de forma escrita e fundamentada.',
  },
  {
    termo: 'Manifestação patológica',
    def: 'Irregularidade que se manifesta em uma construção em decorrência de falhas de projeto, fabricação, instalação, execução, montagem, uso ou manutenção, ou ainda por fatores distintos do envelhecimento natural.',
  },
  {
    termo: 'Manutenção',
    def: 'Conjunto de atividades destinadas a conservar ou recuperar a capacidade funcional de edificações e de seus sistemas, visando atender às necessidades e à segurança de seus usuários.',
  },
  {
    termo: 'Perícia',
    def: 'Atividade técnica realizada por profissional habilitado, desenvolvida de forma fundamentada e em conformidade com requisitos normativos, destinada a averiguar fatos, constatar condições de um objeto, verificar conformidade com padrões estabelecidos, apurar causas e consequências ou avaliar bens e direitos.',
  },
  {
    termo: 'Perito',
    def: 'Pessoa jurídica ou profissional legalmente habilitado e registrado no conselho de classe competente, responsável pela realização de perícia de engenharia.',
  },
  {
    termo: 'Solidez e segurança',
    def: 'Estados relacionados à estabilidade das construções e de suas partes, envolvendo também a segurança dos usuários.',
  },
  {
    termo: 'Vida útil',
    def: 'Período de tempo durante o qual uma construção ou suas partes mantêm desempenho adequado para as funções para as quais foram projetadas, considerando condições normais de uso e manutenção.',
  },
  {
    termo: 'Vida útil de projeto (VUP)',
    def: 'Período estimado para o qual uma construção ou suas partes são projetadas para atender aos critérios de desempenho estabelecidos em normas técnicas, considerando a correta execução das manutenções previstas.',
  },
  {
    termo: 'Vício',
    def: 'Anomalia ou falha que afeta o desempenho de um produto ou serviço ou o torna inadequado à finalidade a que se destina.',
  },
  {
    termo: 'Vício construtivo',
    def: 'Anomalia ou falha com origem associada ao projeto, às especificações de materiais ou à execução da obra.',
  },
  { termo: 'Vício aparente', def: 'Vício de fácil constatação visual.' },
  {
    termo: 'Vício oculto',
    def: 'Vício não perceptível de imediato, que somente se manifesta ao longo do tempo ou que exige conhecimento técnico para sua identificação.',
  },
  {
    termo: 'Vistoria',
    def: 'Espécie de perícia destinada à constatação de fatos, à análise de conformidade ou ao desenvolvimento de investigação técnica fundamentada para apuração de causas e consequências.',
  },
]

export default function Identificacao() {
  const { id } = useParams()
  const { data, updateSection, saveReport } = useReport()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = async () => {
    await saveReport()
    toast({ title: 'Sucesso', description: 'Identificação salva com sucesso.' })
    navigate(`/laudo/${id}/manifestacoes`)
  }

  return (
    <div className="animate-fade-in bg-white p-8 rounded-xl shadow-sm border border-border">
      <div className="text-center mb-8 border-b-2 border-[#2b579a] pb-4">
        <h1 className="text-3xl font-serif text-[#2b579a] font-bold uppercase tracking-wider">
          Laudo Técnico de Engenharia
        </h1>
      </div>

      <div className="space-y-4 mb-12 text-sm">
        <div className="grid grid-cols-[150px_1fr] items-center gap-2">
          <Label className="font-bold text-slate-700 text-right">Destinatário:</Label>
          <Input
            value={data.identificacao.destinatario}
            onChange={(e) => updateSection('identificacao', { destinatario: e.target.value })}
            placeholder="Não informado"
            className="h-8"
          />
        </div>
        <div className="grid grid-cols-[150px_1fr] items-center gap-2">
          <Label className="font-bold text-slate-700 text-right">Local da Vistoria:</Label>
          <Input
            value={data.identificacao.local}
            onChange={(e) => updateSection('identificacao', { local: e.target.value })}
            placeholder="Não informado"
            className="h-8"
          />
        </div>
        <div className="grid grid-cols-[150px_1fr] items-center gap-2">
          <Label className="font-bold text-slate-700 text-right">Data da Vistoria:</Label>
          <Input
            type="date"
            value={data.identificacao.data}
            onChange={(e) => updateSection('identificacao', { data: e.target.value })}
            className="h-8 w-[200px]"
          />
        </div>
        <div className="grid grid-cols-[150px_1fr] items-center gap-2">
          <Label className="font-bold text-slate-700 text-right">Código do documento:</Label>
          <div className="font-mono text-slate-600 pl-3 border-b pb-1">
            LT-{id?.toUpperCase().substring(0, 8)}
          </div>
        </div>
      </div>

      <h2 className="text-[#2b579a] font-serif font-bold text-2xl mb-4">
        Termos e Definições Técnicas de Referência
      </h2>
      <p className="italic text-sm text-slate-600 mb-4">
        Os conceitos a seguir são apresentados como referencial técnico-conceitual de apoio à
        leitura e interpretação deste documento.
      </p>

      <div className="space-y-3 text-sm text-slate-800 text-justify mb-12 leading-relaxed">
        {TERMOS.map((t, idx) => (
          <p key={idx}>
            <strong className="text-slate-900">{t.termo}:</strong> {t.def}
          </p>
        ))}
      </div>

      <h2 className="text-[#2b579a] font-serif font-bold text-2xl mb-4">1. Síntese / Contexto</h2>
      <div className="space-y-2">
        <p className="text-sm text-slate-500 italic mb-2">
          Seção destinada à complementação pelo profissional.
        </p>
        <Textarea
          placeholder="Descreva o contexto geral, objetivos da vistoria, histórico resumido, etc."
          className="min-h-[150px] resize-y"
          value={data.identificacao.sintese || ''}
          onChange={(e) => updateSection('identificacao', { sintese: e.target.value })}
        />
      </div>

      <div className="flex justify-end pt-8">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-4 w-4" /> Salvar e Continuar
        </Button>
      </div>
    </div>
  )
}
