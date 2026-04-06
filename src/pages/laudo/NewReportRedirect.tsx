import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { createReport } from '@/services/reports'
import { defaultData } from '@/context/ReportContext'

export default function NewReportRedirect() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    createReport({
      user_id: user.id,
      title: 'Novo Laudo Técnico',
      data: defaultData,
    })
      .then((record) => {
        navigate(`/laudo/${record.id}/identificacao`)
      })
      .catch((err) => {
        console.error(err)
        navigate('/')
      })
  }, [user, navigate])

  return (
    <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-muted-foreground font-medium">Inicializando novo laudo...</p>
    </div>
  )
}
