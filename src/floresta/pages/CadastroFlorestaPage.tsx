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

interface CadastroFlorestaPageProps {
  onBackToHome?: () => void
}

export function CadastroFlorestaPage({ onBackToHome }: CadastroFlorestaPageProps = {}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Partial<FlorestaSubmission>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setIsSubmitted(true)
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
        <main className="theme-floresta min-h-screen bg-[#17301D] px-4 py-8 md:py-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-[640px] rounded-[32px] bg-white p-8 text-center shadow-2xl">
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
              Notícia Florestal Cadastrada com Sucesso!
            </Text>
            <Text variant="body" className="mt-2 text-[#666666]">
              Os dados foram validados conforme as diretrizes do DATALUTA Floresta.
            </Text>

            <pre className="mt-5 max-h-56 overflow-y-auto rounded-lg bg-[#F8FAF8] border border-[#E0E0E0] p-4 text-left text-xs text-[#333333]">
              {JSON.stringify(formData, null, 2)}
            </pre>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  setIsSubmitted(false)
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
      <main className="theme-floresta min-h-screen bg-[#17301D] px-4 py-8 md:py-12 flex flex-col items-center justify-center">
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
              >
                {isLastStep ? actions.submit : actions.next}
              </Button>
            </>
          }
        >
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
                setFormData((prev) => ({ ...prev, ods: values }))
                handleNext()
              }}
            />
          )}
        </FormCard>
      </main>
    </ThemeProvider>
  )
}

export default CadastroFlorestaPage
