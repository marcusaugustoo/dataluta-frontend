import { useState } from 'react'
import { ACAO_FORM_ID, AcaoStepForm } from '../components/forms/AcaoStepForm'
import { INSTITUICOES_FORM_ID, InstituicoesStepForm } from '../components/forms/InstituicoesStepForm'
import { LOCAL_FORM_ID, LocalStepForm } from '../components/forms/LocalStepForm'
import { LOGIN_FORM_ID, LoginStepForm } from '../components/forms/LoginStepForm'
import { MOVIMENTO_FORM_ID, MovimentoStepForm } from '../components/forms/MovimentoStepForm'
import { NOTICIA_FORM_ID, NoticiaStepForm } from '../components/forms/NoticiaStepForm'
import { ODS_FORM_ID, OdsStepForm } from '../components/forms/OdsStepForm'
import { PAUTA_FORM_ID, PautaStepForm } from '../components/forms/PautaStepForm'
import { FormCard } from '../components/layout/FormCard'
import { Button } from '../components/ui/Button'
import { Text } from '../components/ui/Typography'
import { actions, brand, exampleSubmission, steps } from '../data/mockData'
import type { NoticiaSubmission, StepId } from '../types/form'

export function CadastroNoticiaPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Partial<NoticiaSubmission>>({})
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
    }
  }

  if (isSubmitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#17301D] p-6">
        <div className="w-full max-w-xl rounded-[28px] bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E9F1EA] text-[#2E7D32]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
          <Text variant="body" className="mt-2 text-[#666666]">
            Os dados foram validados conforme o design e schema Zod.
          </Text>

          <pre className="mt-5 max-h-56 overflow-y-auto rounded-lg bg-[#F8F9F8] p-4 text-left text-xs text-[#333333]">
            {JSON.stringify(formData, null, 2)}
          </pre>

          <div className="mt-6 flex justify-center">
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
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#17301D] px-4 py-8 md:py-12 flex flex-col items-center justify-center">
      {/* Botão de apoio para preenchimento de teste com mockData */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          type="button"
          onClick={() => setFormData(exampleSubmission)}
          className="rounded-full border border-white/20 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-white shadow-lg hover:bg-black/60 transition-colors cursor-pointer"
          title="Preenche o formulário com o mockData extraído do PDF"
        >
          ⚡ Preencher Mock
        </button>
      </div>

      <FormCard
        brand={brand}
        steps={steps}
        currentStep={currentStep.id}
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
          <LoginStepForm
            defaultValues={formData.login}
            onValid={(vals) => {
              setFormData((prev) => ({ ...prev, login: vals }))
              handleNext()
            }}
          />
        )}

        {currentStep.id === 'noticia' && (
          <NoticiaStepForm
            defaultValues={formData.noticia}
            onValid={(vals) => {
              setFormData((prev) => ({ ...prev, noticia: vals }))
              handleNext()
            }}
          />
        )}

        {currentStep.id === 'local' && (
          <LocalStepForm
            defaultValues={formData.local}
            onValid={(vals) => {
              setFormData((prev) => ({ ...prev, local: vals }))
              handleNext()
            }}
          />
        )}

        {currentStep.id === 'acao' && (
          <AcaoStepForm
            defaultValues={formData.acao}
            onValid={(vals) => {
              setFormData((prev) => ({ ...prev, acao: vals }))
              handleNext()
            }}
          />
        )}

        {currentStep.id === 'pauta' && (
          <PautaStepForm
            defaultValues={formData.pauta}
            onValid={(vals) => {
              setFormData((prev) => ({ ...prev, pauta: vals }))
              handleNext()
            }}
          />
        )}

        {currentStep.id === 'movimento' && (
          <MovimentoStepForm
            defaultValues={formData.movimento}
            onValid={(vals) => {
              setFormData((prev) => ({ ...prev, movimento: vals }))
              handleNext()
            }}
          />
        )}

        {currentStep.id === 'instituicoes' && (
          <InstituicoesStepForm
            defaultValues={formData.instituicoes}
            onValid={(vals) => {
              setFormData((prev) => ({ ...prev, instituicoes: vals }))
              handleNext()
            }}
          />
        )}

        {currentStep.id === 'ods' && (
          <OdsStepForm
            defaultValues={formData.ods}
            onValid={(vals) => {
              setFormData((prev) => ({ ...prev, ods: vals }))
              handleNext()
            }}
          />
        )}
      </FormCard>
    </main>
  )
}
