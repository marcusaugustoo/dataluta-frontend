import { useState } from 'react'
import { ACAO_FORM_ID, FlorestaAcaoStepForm } from '../components/steps/FlorestaAcaoStepForm'
import { INSTITUICOES_FORM_ID, FlorestaInstituicoesStepForm } from '../components/steps/FlorestaInstituicoesStepForm'
import { LOCAL_FORM_ID, FlorestaLocalStepForm } from '../components/steps/FlorestaLocalStepForm'
import { LOGIN_FORM_ID, FlorestaLoginStepForm } from '../components/steps/FlorestaLoginStepForm'
import { MOVIMENTO_FORM_ID, FlorestaMovimentoStepForm } from '../components/steps/FlorestaMovimentoStepForm'
import { NOTICIA_FORM_ID, FlorestaNoticiaStepForm } from '../components/steps/FlorestaNoticiaStepForm'
import { ODS_FORM_ID, FlorestaOdsStepForm } from '../components/steps/FlorestaOdsStepForm'
import { PAUTA_FORM_ID, FlorestaPautaStepForm } from '../components/steps/FlorestaPautaStepForm'
import { FlorestaBrandHeader } from '../components/FlorestaBrandHeader'
import { FormCard } from '../../components/layout/FormCard'
import { Button } from '../../components/ui/Button'
import { Text } from '../../components/ui/Typography'
import { actions, brand, steps } from '../data/florestaData'
import type { FlorestaSubmission, StepId } from '../types/florestaTypes'
import { ThemeProvider } from '../../context/ThemeContext'
import { enviarNoticia } from '../../services/noticiasService'

interface CadastroFlorestaPageProps {
  onBackToHome?: () => void
}

export function CadastroFlorestaPage({ onBackToHome }: CadastroFlorestaPageProps = {}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Partial<FlorestaSubmission>>({})
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

  const handleFinalSubmit = async (odsVals: FlorestaSubmission['ods']) => {
    const requiredSteps: Array<{ key: keyof FlorestaSubmission; label: string; index: number }> = [
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

    const payload = { ...formData, ods: odsVals } as FlorestaSubmission
    setFormData(payload)
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await enviarNoticia('floresta', payload)
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
        return LOGIN_FORM_ID
      case 'noticia':
        return NOTICIA_FORM_ID
      case 'local':
        return LOCAL_FORM_ID
      case 'acao':
        return ACAO_FORM_ID
      case 'pauta':
        return PAUTA_FORM_ID
      case 'movimento':
        return MOVIMENTO_FORM_ID
      case 'instituicoes':
        return INSTITUICOES_FORM_ID
      case 'ods':
        return ODS_FORM_ID
      default:
        return ''
    }
  }

  if (isSubmitted) {
    return (
      <ThemeProvider theme="floresta">
        <div className="fixed inset-0 -z-10 bg-[#17301D]" aria-hidden="true" />
        <main className="theme-floresta min-h-screen bg-[#17301D] px-4 py-8 md:py-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-[520px] rounded-[32px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E9F1EA] text-[#2E7D32]">
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
              <div className="mt-4 rounded-xl bg-[#F8FAF8] border border-[#E0E0E0] px-4 py-3.5 text-center">
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
    <ThemeProvider theme="floresta">
      <div className="fixed inset-0 -z-10 bg-[#17301D]" aria-hidden="true" />
      <main className="theme-floresta min-h-screen bg-[#17301D] px-4 pt-8 pb-28 md:pt-12 md:pb-32 flex flex-col items-center justify-center">
        <FormCard
          brand={brand}
          steps={steps}
          currentStep={currentStep.id}
          theme="floresta"
          customHeader={<FlorestaBrandHeader title={brand.title} subtitle={brand.subtitle} />}
          onBackToHome={onBackToHome}
          onStepClick={(stepId: StepId) => {
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
            <FlorestaLoginStepForm
              defaultValues={formData.login}
              onValid={(values) => {
                setFormData((prev) => ({ ...prev, login: values }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'noticia' && (
            <FlorestaNoticiaStepForm
              defaultValues={formData.noticia}
              onValid={(values) => {
                setFormData((prev) => ({ ...prev, noticia: values }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'local' && (
            <FlorestaLocalStepForm
              defaultValues={formData.local}
              onValid={(values) => {
                setFormData((prev) => ({ ...prev, local: values }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'acao' && (
            <FlorestaAcaoStepForm
              defaultValues={formData.acao}
              onValid={(values) => {
                setFormData((prev) => ({ ...prev, acao: values }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'pauta' && (
            <FlorestaPautaStepForm
              defaultValues={formData.pauta}
              onValid={(values) => {
                setFormData((prev) => ({ ...prev, pauta: values }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'movimento' && (
            <FlorestaMovimentoStepForm
              defaultValues={formData.movimento}
              onValid={(values) => {
                setFormData((prev) => ({ ...prev, movimento: values }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'instituicoes' && (
            <FlorestaInstituicoesStepForm
              defaultValues={formData.instituicoes}
              onValid={(values) => {
                setFormData((prev) => ({ ...prev, instituicoes: values }))
                handleNext()
              }}
            />
          )}

          {currentStep.id === 'ods' && (
            <FlorestaOdsStepForm
              defaultValues={formData.ods}
              onValid={(values) => {
                void handleFinalSubmit(values)
              }}
            />
          )}
        </FormCard>
      </main>
    </ThemeProvider>
  )
}

export default CadastroFlorestaPage
