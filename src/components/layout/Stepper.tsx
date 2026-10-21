import { Fragment } from 'react'
import { useFormTheme, type FormTheme } from '../../context/ThemeContext'
import type { Step } from '../../types/form'
import { cn } from '../../utils/cn'

interface StepperProps {
  steps: readonly Step[]
  currentStep: string
  theme?: FormTheme
  onStepClick?: (id: any) => void
}

/**
 * Stepper horizontal com 8 etapas, adaptável aos temas Floresta e Agrário.
 */
export function Stepper({ steps, currentStep, theme: explicitTheme, onStepClick }: StepperProps) {
  const { theme: contextTheme } = useFormTheme()
  const theme = explicitTheme ?? contextTheme
  const isAgrario = theme === 'agrario'

  return (
    <nav aria-label="Etapas do formulário" className="w-full">
      <ol className="flex w-full items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep

          return (
            <Fragment key={step.id}>
              <li className="flex items-center">
                <button
                  type="button"
                  id={`step-${step.id}`}
                  onClick={onStepClick ? () => onStepClick(step.id) : undefined}
                  disabled={!onStepClick}
                  aria-current={isActive ? 'step' : undefined}
                  className="flex items-center gap-2 cursor-pointer group focus:outline-none"
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-150',
                      isActive
                        ? isAgrario
                          ? 'bg-[#B45309] text-white shadow-sm'
                          : 'bg-[#2E7D32] text-white'
                        : isAgrario
                          ? 'border-[1.5px] border-[#B45309] bg-white text-[#B45309] group-hover:bg-[#FEF3C7]'
                          : 'border-[1.5px] border-[#2E7D32] bg-white text-[#2E7D32] group-hover:bg-[#E9F1EA]',
                    )}
                  >
                    {step.order}
                  </span>
                  <span
                    className={cn(
                      'text-[14px] transition-colors',
                      isActive ? 'font-medium text-[#222222]' : 'text-[#333333] font-normal',
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              </li>

              {index < steps.length - 1 && (
                <li aria-hidden="true" className="h-[1px] flex-1 max-w-[24px] bg-[#666666] mx-1" />
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

