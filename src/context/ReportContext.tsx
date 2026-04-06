import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getReport, updateReport } from '@/services/reports'

export type Manifestacao = {
  id: string
  titulo: string
  localizacao: string
  intensidade: string
  evolucao: string
  observacoes: string
}

export type ReportData = {
  identificacao: {
    destinatario: string
    local: string
    data: string
    codigo: string
    sintese: string
  }
  manifestacoes: Manifestacao[]
  evidencias: {
    monitoramento: string
    eventos: string
    associadas: string
  }
  hipoteses: {
    principal: { descricao: string; criterios: string; confianca: string }
  }
  consolidacao: {
    diagnostico: string
    prognostico: string
    recomendacoes: string
    limitacoes: string
  }
  metodologia: {
    procedimentosAdotados: string[]
    limitacoesInvestigacao: string[]
    alcanceInterpretativo: string
    amplitudeTecnica: string
    lacunasMetodologicas: string
  }
  estimativa: {
    compreensao: number | ''
    estudo: number | ''
    organizacao: number | ''
    tratamento: number | ''
    consolidacao: number | ''
  }
  encerramento: {
    texto: string
    responsabilidade?: string
  }
  anexos: {
    tipos: string[]
    quantidadeFotos: number | ''
    organizacaoFotos: string
  }
  classificacao: {
    tipo: string
    estadoDesempenho: string
    prioridade: string
    matrizGUT: {
      gravidade: number | ''
      urgencia: number | ''
      tendencia: number | ''
    }
  }
  referencias: {
    texto: string
    aceiteResponsabilidade: boolean
  }
}

export const defaultData: ReportData = {
  identificacao: { destinatario: '', local: '', data: '', codigo: '', sintese: '' },
  manifestacoes: [],
  evidencias: { monitoramento: '', eventos: '', associadas: '' },
  hipoteses: { principal: { descricao: '', criterios: '', confianca: '' } },
  consolidacao: { diagnostico: '', prognostico: '', recomendacoes: '', limitacoes: '' },
  metodologia: {
    procedimentosAdotados: [],
    limitacoesInvestigacao: [],
    alcanceInterpretativo: '',
    amplitudeTecnica: '',
    lacunasMetodologicas: '',
  },
  estimativa: { compreensao: '', estudo: '', organizacao: '', tratamento: '', consolidacao: '' },
  encerramento: { texto: '', responsabilidade: '' },
  anexos: { tipos: [], quantidadeFotos: '', organizacaoFotos: '' },
  classificacao: {
    tipo: '',
    estadoDesempenho: '',
    prioridade: '',
    matrizGUT: { gravidade: '', urgencia: '', tendencia: '' },
  },
  referencias: { texto: '', aceiteResponsabilidade: false },
}

type ReportContextType = {
  data: ReportData
  updateSection: <K extends keyof ReportData>(section: K, payload: Partial<ReportData[K]>) => void
  setManifestacoes: (manifestacoes: Manifestacao[]) => void
  saveReport: () => Promise<void>
  loading: boolean
}

const ReportContext = createContext<ReportContextType | undefined>(undefined)

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams()
  const [data, setData] = useState<ReportData>(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getReport(id)
        .then((record) => {
          setData({ ...defaultData, ...(record.data || {}) })
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [id])

  const updateSection = <K extends keyof ReportData>(
    section: K,
    payload: Partial<ReportData[K]>,
  ) => {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], ...payload } }))
  }

  const setManifestacoes = (manifestacoes: Manifestacao[]) => {
    setData((prev) => ({ ...prev, manifestacoes }))
  }

  const saveReport = async () => {
    if (id) {
      await updateReport(id, {
        title: data.identificacao.destinatario || 'Laudo sem título',
        data,
      })
    }
  }

  return (
    <ReportContext.Provider value={{ data, updateSection, setManifestacoes, saveReport, loading }}>
      {children}
    </ReportContext.Provider>
  )
}

export const useReport = () => {
  const context = useContext(ReportContext)
  if (!context) throw new Error('useReport must be used within a ReportProvider')
  return context
}
