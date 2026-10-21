import type { ReactNode } from 'react'
import { useFormTheme, type FormTheme } from '../../context/ThemeContext'
import type { Step } from '../../types/form'
import { ArrowLeftIcon } from '../ui/icons'
import { cn } from '../../utils/cn'
import { BrandHeader } from './BrandHeader'
import { Stepper } from './Stepper'

interface FormCardProps {
  brand?: { title: string; subtitle: string }
  steps: readonly Step[]
  currentStep: string
  theme?: FormTheme
  customHeader?: ReactNode
  onBackToHome?: () => void
  onStepClick?: (id: any) => void
  children: ReactNode
  footer: ReactNode
}

/**
 * Card com cantos arredondados (rounded-[32px]) sobre fundo imersivo,
 * destacando o formulário com espaçamentos harmoniosos e navegação de retorno.
 */
export function FormCard({
  brand = { title: 'Dataluta Floresta', subtitle: 'Formulário para cadastro de notícias' },
  steps,
  currentStep,
  theme,
  customHeader,
  onBackToHome,
  onStepClick,
  children,
  footer,
}: FormCardProps) {
  const { theme: contextTheme } = useFormTheme()
  const activeTheme = theme ?? contextTheme

  return (
    <div className="mx-auto my-6 w-full max-w-[1000px] flex flex-col items-center">
      {/* Barra superior de navegação */}
      {onBackToHome && (
        <div className="w-full flex items-center justify-start mb-4 px-1">
          <button
            type="button"
            onClick={onBackToHome}
            className={cn(
              'inline-flex h-[38px] min-w-[140px] items-center justify-center gap-2 rounded-[8px] px-5 text-[15px] font-medium',
              'transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              'border border-white bg-transparent text-white hover:bg-white/10 active:bg-white/20 shadow-xs',
            )}
          >
            <ArrowLeftIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Voltar ao menu</span>
          </button>
        </div>
      )}

      {/* Card branco com cantos arredondados */}
      <div className="w-full rounded-[32px] bg-white p-6 shadow-2xl md:p-10">
        {/* Banner Superior */}
        {customHeader ? (
          customHeader
        ) : (
          <BrandHeader title={brand.title} subtitle={brand.subtitle} />
        )}

        {/* Stepper de 8 etapas */}
        <div className="mt-6">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            theme={activeTheme}
            onStepClick={onStepClick}
          />
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
    </div>
  )
}

