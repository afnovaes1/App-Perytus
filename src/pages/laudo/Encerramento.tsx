import React from 'react'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

export default function Encerramento() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleFinish = () => {
    toast({
      title: 'Laudo finalizado',
      description: 'O laudo técnico foi salvo com sucesso.',
    })
    navigate('/')
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-serif font-semibold text-primary mb-1">
          Encerramento do Laudo
        </h2>
        <p className="text-muted-foreground">
          Revise as informações e finalize a emissão do documento
        </p>
      </div>

      <Card>
        <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold">Todas as seções foram preenchidas</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Você concluiu o preenchimento metodológico do laudo. Certifique-se de que todas as
            informações, fotos e classificações estão corretas antes de finalizar.
          </p>
          <div className="pt-6 flex gap-4">
            <Button variant="outline" onClick={() => navigate('/laudo/novo/classificacao')}>
              Revisar anterior
            </Button>
            <Button onClick={handleFinish}>Finalizar e Exportar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
