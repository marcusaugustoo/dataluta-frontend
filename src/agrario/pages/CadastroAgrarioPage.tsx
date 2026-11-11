import { useState } from 'react'
import { ThemeProvider } from '../../context/ThemeContext'
import { FormCard } from '../../components/layout/FormCard'
import { Button } from '../../components/ui/Button'
import { Text } from '../../components/ui/Typography'
import { AgrarioBrandHeader } from '../components/AgrarioBrandHeader'
import {
  AGRARIO_ACAO_FORM_ID,
  AgrarioAcaoStepForm,
} from '../components/steps/AgrarioAcaoStepForm'
import {
  AGRARIO_INSTITUICOES_FORM_ID,
  AgrarioInstituicoesStepForm,
} from '../components/steps/AgrarioInstituicoesStepForm'
import {
  AGRARIO_LOCAL_FORM_ID,
  AgrarioLocalStepForm,
} from '../components/steps/AgrarioLocalStepForm'
import {
  AGRARIO_LOGIN_FORM_ID,
  AgrarioLoginStepForm,
} from '../components/steps/AgrarioLoginStepForm'
import {
  AGRARIO_MOVIMENTO_FORM_ID,
  AgrarioMovimentoStepForm,
} from '../components/steps/AgrarioMovimentoStepForm'
import {
  AGRARIO_NOTICIA_FORM_ID,
  AgrarioNoticiaStepForm,
} from '../components/steps/AgrarioNoticiaStepForm'
import {
  AGRARIO_ODS_FORM_ID,
  AgrarioOdsStepForm,
} from '../components/steps/AgrarioOdsStepForm'
import {
  AGRARIO_PAUTA_FORM_ID,
  AgrarioPautaStepForm,
} from '../components/steps/AgrarioPautaStepForm'
import { actions, brand, steps } from '../data/agrarioData'
import type { AgrarioStepId, AgrarioSubmission } from '../types/agrarioTypes'
import { enviarNoticia } from '../../services/noticiasService'

interface CadastroAgrarioPageProps {
  onBackToHome?: () => void
}

export function CadastroAgrarioPage({ onBackToHome }: CadastroAgrarioPageProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Partial<AgrarioSubmission>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const handleNext = () => {
    setSubmitError(null)
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFinalSubmit = async (odsVals: AgrarioSubmission['ods']) => {
    const requiredSteps: Array<{ key: keyof AgrarioSubmission; label: string; index: number }> = [
      { key: 'login', label: 'Login', index: 0 },
      { key: 'noticia', label: 'Notícia', index: 1 },
      { key: 'local', label: 'Local', index: 2 },
      { key: 'acao', label: 'Ação', index: 3 },
      { key: 'pauta', label: 'Pauta', index: 4 },
      { key: 'movimento', label: 'Movimento', index: 5 },
      { key: 'instituicoes', label: 'Instituições', index: 6 },
    ]
    const missingStep = requiredSteps.find((s) => !formData[s.key])
    if (missingStep) {
      setFormData((prev) => ({ ...prev, ods: odsVals }))
      setCurrentStepIndex(missingStep.index)
      setSubmitError(`Preencha e confirme a etapa "${missingStep.label}" antes de enviar.`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const payload = { ...formData, ods: odsVals } as AgrarioSubmission
    setFormData(payload)
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await enviarNoticia('agrario', payload)
      setIsSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao enviar notícia.'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getActiveFormId = (): string => {
    switch (currentStep.id) {
      case 'login':
        return AGRARIO_LOGIN_FORM_ID
      case 'noticia':
        return AGRARIO_NOTICIA_FORM_ID
      case 'local':
        return AGRARIO_LOCAL_FORM_ID
      case 'acao':
        return AGRARIO_ACAO_FORM_ID
      case 'pauta':
        return AGRARIO_PAUTA_FORM_ID
      case 'movimento':
        return AGRARIO_MOVIMENTO_FORM_ID
      case 'instituicoes':
        return AGRARIO_INSTITUICOES_FORM_ID
      case 'ods':
        return AGRARIO_ODS_FORM_ID
    }
  }

  if (isSubmitted) {
    return (
      <ThemeProvider theme="agrario">
        <div
          className="fixed inset-0 -z-10 bg-gradient-to-br from-[#1C1108] via-[#2B1B10] to-[#140C07]"
          aria-hidden="true"
        />
        <main className="theme-agrario flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1C1108] via-[#2B1B10] to-[#140C07] p-6">
          <div className="w-full max-w-[520px] rounded-[28px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3C7] text-[#B45309]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Text variant="display" className="mt-4 text-[#222222]">
              Notícia Cadastrada com Sucesso!
            </Text>

            {formData.noticia?.titulo && (
              <div className="mt-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] px-4 py-3.5 text-center">
                <p className="text-[15px] font-semibold text-[#222222]">
                  {formData.noticia.titulo}
                </p>
                {(formData.login?.codigoNoticia || formData.noticia.fonte) && (
                  <p className="mt-1 text-[13px] text-[#666666]">
                    {[formData.login?.codigoNoticia, formData.noticia.fonte]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  setIsSubmitted(false)
                  setSubmitError(null)
                  setCurrentStepIndex(0)
                  setFormData({})
                }}
              >
                Novo Cadastro
              </Button>

              {onBackToHome && (
                <Button variant="outline" onClick={onBackToHome}>
                  Voltar ao Menu
                </Button>
              )}
            </div>
          </div>
        </main>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme="agrario">
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-[#1C1108] via-[#2B1B10] to-[#140C07]"
        aria-hidden="true"
      />
      <main className="theme-agrario min-h-screen bg-gradient-to-br from-[#1C1108] via-[#2B1B10] to-[#140C07] px-4 pt-8 pb-28 md:pt-12 md:pb-32 flex flex-col items-center justify-center">
        <FormCard
          brand={brand}
          steps={steps}
          currentStep={currentStep.id}
          theme="agrario"
          customHeader={<AgrarioBrandHeader />}
          onBackToHome={onBackToHome}
          onStepClick={(stepId: AgrarioStepId) => {
            const idx = steps.findIndex((s) => s.id === stepId)
            if (idx !== -1) setCurrentStepIndex(idx)
          }}
          footer={
            <>
              <div>
                {!isFirstStep ? (
                  <Button variant="outline" onClick={handleBack}>
                    {actions.back}
                  </Button>
                ) : (
                  <div />
                )}
              </div>

              <Button
                type="submit"
                form={getActiveFormId()}
                variant="primary"
                withArrow={!isLastStep}
                disabled={isSubmitting}
              >
                {isLastStep ? (isSubmitting ? 'ENVIANDO...' : actions.submit) : actions.next}
              </Button>
            </>
          }
        >
          {submitError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <strong>Erro ao salvar no banco:</strong> {submitError}
            </div>
          )}

          {currentStep.id === 'login' && (
            <AgrarioLoginStepForm
              defaultValues={formData.login}
              onValid={(vals) => {
                setFormData((prev) => ({ ...prev, login: vals }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'noticia' && (
            <AgrarioNoticiaStepForm
              defaultValues={formData.noticia}
              onValid={(vals) => {
                setFormData((prev) => ({ ...prev, noticia: vals }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'local' && (
            <AgrarioLocalStepForm
              defaultValues={formData.local}
              onValid={(vals) => {
                setFormData((prev) => ({ ...prev, local: vals }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'acao' && (
            <AgrarioAcaoStepForm
              defaultValues={formData.acao}
              onValid={(vals) => {
                setFormData((prev) => ({ ...prev, acao: vals }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'pauta' && (
            <AgrarioPautaStepForm
              defaultValues={formData.pauta}
              onValid={(vals) => {
                setFormData((prev) => ({ ...prev, pauta: vals }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'movimento' && (
            <AgrarioMovimentoStepForm
              defaultValues={formData.movimento}
              onValid={(vals) => {
                setFormData((prev) => ({ ...prev, movimento: vals }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'instituicoes' && (
            <AgrarioInstituicoesStepForm
              defaultValues={formData.instituicoes}
              onValid={(vals) => {
                setFormData((prev) => ({ ...prev, instituicoes: vals }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'ods' && (
            <AgrarioOdsStepForm
              defaultValues={formData.ods}
              onValid={(vals) => {
                void handleFinalSubmit(vals)
              }}
            />
          )}
        </FormCard>
      </main>
    </ThemeProvider>
  )
}
