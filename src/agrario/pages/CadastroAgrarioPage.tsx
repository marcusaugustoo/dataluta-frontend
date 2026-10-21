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

interface CadastroAgrarioPageProps {
  onBackToHome?: () => void
}

export function CadastroAgrarioPage({ onBackToHome }: CadastroAgrarioPageProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Partial<AgrarioSubmission>>({})
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
        <main className="theme-agrario flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1C1108] via-[#2B1B10] to-[#140C07] p-6">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-8 text-center shadow-2xl">
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
              Notícia Agrária Cadastrada com Sucesso!
            </Text>
            <Text variant="body" className="mt-2 text-[#666666]">
              Os dados foram validados conforme as diretrizes do DATALUTA Agrário.
            </Text>

            <pre className="mt-5 max-h-56 overflow-y-auto rounded-lg bg-[#FFFBEB] border border-[#FDE68A] p-4 text-left text-xs text-[#333333]">
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
    <ThemeProvider theme="agrario">
      <main className="theme-agrario min-h-screen bg-gradient-to-br from-[#1C1108] via-[#2B1B10] to-[#140C07] px-4 py-8 md:py-12 flex flex-col items-center justify-center">
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
              >
                {isLastStep ? actions.submit : actions.next}
              </Button>
            </>
          }
        >
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
                setFormData((prev) => ({ ...prev, ods: vals }))
                handleNext()
              }}
            />
          )}
        </FormCard>
      </main>
    </ThemeProvider>
  )
}
