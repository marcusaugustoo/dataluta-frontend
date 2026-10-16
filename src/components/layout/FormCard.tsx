import type { ReactNode } from 'react'
import type { Step, StepId } from '../../types/form'
import { BrandHeader } from './BrandHeader'
import { Stepper } from './Stepper'

interface FormCardProps {
  brand: { title: string; subtitle: string }
  steps: readonly Step[]
  currentStep: StepId
  onStepClick?: (id: StepId) => void
  children: ReactNode
  footer: ReactNode
}

/**
 * Card branco com cantos arredondados (rounded-[32px]) sobre o fundo verde #17301D,
 * destacando o formulário com espaçamentos harmoniosos.
 */
export function FormCard({
  brand,
  steps,
  currentStep,
  onStepClick,
  children,
  footer,
}: FormCardProps) {
  return (
    <div className="mx-auto my-8 w-full max-w-[1000px] rounded-[32px] bg-white p-6 shadow-2xl md:p-10">
      {/* Banner Superior */}
      <BrandHeader title={brand.title} subtitle={brand.subtitle} />

      {/* Stepper de 8 etapas */}
      <div className="mt-6">
        <Stepper steps={steps} currentStep={currentStep} onStepClick={onStepClick} />
      </div>

      {/* Linha divisória superior */}
      <hr className="mt-5 border-t border-[#E0E0E0]" />

      {/* Área de conteúdo do formulário */}
      <div className="min-h-[440px] py-4">{children}</div>

      {/* Linha divisória inferior */}
      <hr className="border-t border-[#E0E0E0]" />

      {/* Barra de ação inferior (Voltar e Próximo/Enviar) */}
      <div className="mt-5 flex items-center justify-between">{footer}</div>
    </div>
  )
}
