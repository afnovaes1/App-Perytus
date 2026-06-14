import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileSignature, CheckCircle2 } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

const emailSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
})

const otpSchema = z.object({
  otp: z.string().min(6, { message: 'O código deve ter no mínimo 6 caracteres' }),
})

export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [otpId, setOtpId] = useState<string>('')

  const { requestMagicLink, verifyMagicLink, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const urlOtpId = searchParams.get('otpId')
  const urlToken = searchParams.get('token')
  const verifyCalled = useRef(false)

  useEffect(() => {
    if (urlOtpId && urlToken && !verifyCalled.current) {
      verifyCalled.current = true
      setIsLoading(true)
      verifyMagicLink(urlOtpId, urlToken).then(({ error }) => {
        setIsLoading(false)
        if (error) {
          setError(getErrorMessage(error))
          setStep('email')
        } else {
          navigate('/')
        }
      })
    }
  }, [urlOtpId, urlToken, navigate, verifyMagicLink])

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  async function onEmailSubmit(data: z.infer<typeof emailSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccessMsg(null)

    const { data: resData, error: reqError } = await requestMagicLink(data.email)

    setIsLoading(false)

    if (reqError) {
      setError(getErrorMessage(reqError))
    } else if (resData?.otpId) {
      setOtpId(resData.otpId)
      setStep('otp')
      setSuccessMsg('Código de acesso enviado para seu e-mail.')
    } else {
      setStep('otp')
      setSuccessMsg('Código de acesso enviado para seu e-mail.')
    }
  }

  async function onOtpSubmit(data: z.infer<typeof otpSchema>) {
    setIsLoading(true)
    setError(null)

    const { error: verifyError } = await verifyMagicLink(otpId, data.otp)

    setIsLoading(false)

    if (verifyError) {
      setError(getErrorMessage(verifyError))
    } else {
      navigate('/')
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-[400px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <FileSignature className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Acesso ao Sistema</h1>
            <p className="text-muted-foreground">
              {step === 'email'
                ? 'Insira seu e-mail para receber um link de acesso seguro'
                : 'Insira o código de 6 dígitos enviado para seu e-mail'}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMsg && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}

          {step === 'email' ? (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com.br" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Enviar Link de Acesso'}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center">
                      <FormLabel>Código de Acesso</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verificando...' : 'Entrar'}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    setStep('email')
                    setSuccessMsg(null)
                  }}
                  disabled={isLoading}
                >
                  Voltar
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <img
          src="https://img.usecurling.com/p/800/1200?q=building%20inspection%20blueprint&color=blue"
          alt="Engenheiro inspecionando planta"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
      </div>
    </div>
  )
}
