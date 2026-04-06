import React, { createContext, useContext, useState, ReactNode } from 'react'

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
    texto: string
  }
  consolidacao: {
    conclusao: string
    recomendacoes: string
  }
  metodologia: {
    normas: string
  }
}

const defaultData: ReportData = {
  identificacao: { destinatario: '', local: '', data: undefined },
  manifestacoes: [],
  evidencias: { monitoramento: '', eventos: '', associadas: '', comparativos: '' },
  hipoteses: { texto: '' },
  consolidacao: { conclusao: '', recomendacoes: '' },
  metodologia: { normas: '' },
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
