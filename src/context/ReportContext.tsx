import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Manifestacao = {
  id: string
  titulo: string
  localizacao: string
  intensidade: string
  evolucao: string
  observacoes: string
}

export type HipoteseConfianca = 'alta' | 'media' | 'baixa' | ''

export type Hipotese = {
  id: string
  descricao: string
  criterios: string
  confianca: HipoteseConfianca
  principal: boolean
}

export type AnexosData = {
  tipos: string[]
  descricaoAdicional: string
  relatorioFotografico: {
    quantidade: string
    organizacao: string
    observacoes: string
  }
  observacoesGerais: string
}

export type ClassificacaoData = {
  estadoDesempenho: {
    classe: string
    justificativa: string
  }
  prioridade: {
    grau: string
    fundamentacao: string
  }
  matrizGUT: {
    gravidade: number | ''
    urgencia: number | ''
    tendencia: number | ''
    justificativa: string
  }
}

export type EncerramentoData = {
  volumeDocumentos: string
  quantidadeFotos: number | ''
  horasAnaliseManual?: number | ''
  horasImagensManual?: number | ''
  horasRedacaoManual?: number | ''
}

export type ReportData = {
  identificacao: {
    destinatario: string
    local: string
    data: Date | undefined
  }
  manifestacoes: Manifestacao[]
  evidencias: {
    monitoramento: string
    eventos: string
    associadas: string
    comparativos: string
  }
  hipoteses: {
    lista: Hipotese[]
  }
  consolidacao: {
    diagnostico: string
    prognostico: string
    recomendacoes: string
    limitacoes: string
  }
  metodologia: {
    procedimentosAdotados: string[]
    detalhamentoProcedimentos: string
    limitacoesInvestigacao: string[]
    descricaoLimitacoes: string
    alcanceInterpretativo: string
  }
  anexos: AnexosData
  classificacao: ClassificacaoData
  encerramento: EncerramentoData
}

const defaultData: ReportData = {
  identificacao: { destinatario: '', local: '', data: undefined },
  manifestacoes: [],
  evidencias: { monitoramento: '', eventos: '', associadas: '', comparativos: '' },
  hipoteses: {
    lista: [{ id: '1', descricao: '', criterios: '', confianca: '', principal: true }],
  },
  consolidacao: { diagnostico: '', prognostico: '', recomendacoes: '', limitacoes: '' },
  metodologia: {
    procedimentosAdotados: [],
    detalhamentoProcedimentos: '',
    limitacoesInvestigacao: [],
    descricaoLimitacoes: '',
    alcanceInterpretativo: '',
  },
  anexos: {
    tipos: [],
    descricaoAdicional: '',
    relatorioFotografico: { quantidade: '', organizacao: '', observacoes: '' },
    observacoesGerais: '',
  },
  classificacao: {
    estadoDesempenho: { classe: '', justificativa: '' },
    prioridade: { grau: '', fundamentacao: '' },
    matrizGUT: { gravidade: '', urgencia: '', tendencia: '', justificativa: '' },
  },
  encerramento: {
    volumeDocumentos: 'elevado',
    quantidadeFotos: 55,
    horasAnaliseManual: '',
    horasImagensManual: '',
    horasRedacaoManual: '',
  },
}

type ReportContextType = {
  data: ReportData
  updateSection: <K extends keyof ReportData>(section: K, payload: Partial<ReportData[K]>) => void
  setManifestacoes: (manifestacoes: Manifestacao[]) => void
}

const ReportContext = createContext<ReportContextType | undefined>(undefined)

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ReportData>(defaultData)

  const updateSection = <K extends keyof ReportData>(
    section: K,
    payload: Partial<ReportData[K]>,
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...payload,
      },
    }))
  }

  const setManifestacoes = (manifestacoes: Manifestacao[]) => {
    setData((prev) => ({ ...prev, manifestacoes }))
  }

  return (
    <ReportContext.Provider value={{ data, updateSection, setManifestacoes }}>
      {children}
    </ReportContext.Provider>
  )
}

export const useReport = () => {
  const context = useContext(ReportContext)
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider')
  }
  return context
}
