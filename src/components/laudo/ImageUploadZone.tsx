import React, { useState, useRef } from 'react'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'

interface ImageUploadZoneProps {
  reportId: string
  manifestationId: string
  imageRecord?: any
  index: number
}

export function ImageUploadZone({
  reportId,
  manifestationId,
  imageRecord,
  index,
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma imagem.',
        variant: 'destructive',
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 5MB.',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('report_id', reportId)
      formData.append('manifestation_id', manifestationId)
      formData.append('user_id', pb.authStore.record?.id || '')
      formData.append('file', file)

      if (imageRecord) {
        await pb.collection('manifestation_images').update(imageRecord.id, formData)
      } else {
        await pb.collection('manifestation_images').create(formData)
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao salvar a imagem.', variant: 'destructive' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!imageRecord) return
    setIsUploading(true)
    try {
      await pb.collection('manifestation_images').delete(imageRecord.id)
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao remover a imagem.', variant: 'destructive' })
    } finally {
      setIsUploading(false)
    }
  }

  const imageUrl = imageRecord ? pb.files.getUrl(imageRecord, imageRecord.file) : null

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-t-lg bg-slate-50 min-h-[250px] flex flex-col items-center justify-center transition-colors cursor-pointer group overflow-hidden',
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-100',
        imageUrl && 'border-transparent bg-black',
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0])
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          if (e.target.files?.[0]) handleUpload(e.target.files[0])
        }}
      />

      {isUploading ? (
        <div className="flex flex-col items-center justify-center text-slate-500 z-10">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <span className="text-sm font-medium">Enviando...</span>
        </div>
      ) : imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="Manifestação"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-2">
              <X className="h-4 w-4" /> Remover Foto
            </Button>
          </div>
        </>
      ) : (
        <>
          <UploadCloud className="h-10 w-10 mb-2 text-slate-400 group-hover:text-blue-500 transition-colors z-10" />
          <span className="text-sm text-slate-500 font-medium group-hover:text-blue-600 transition-colors z-10">
            Clique ou arraste uma foto aqui
          </span>
          <span className="text-xs text-slate-400 mt-1 z-10">JPEG, PNG, WebP até 5MB</span>
        </>
      )}

      <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold border rounded shadow-sm z-20 text-slate-700">
        Foto {index + 1}
      </div>
    </div>
  )
}
