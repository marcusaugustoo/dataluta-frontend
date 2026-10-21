import type { ComponentProps } from 'react'
import { useFormTheme, type FormTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/cn'
import { ArrowRightIcon } from './icons'

type ButtonVariant = 'primary' | 'outline'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  theme?: FormTheme
  withArrow?: boolean
}

export function Button({
  variant = 'primary',
  theme: explicitTheme,
  withArrow = false,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const { theme: contextTheme } = useFormTheme()
  const theme = explicitTheme ?? contextTheme

  const isAgrario = theme === 'agrario'

  const variantClass =
    variant === 'primary'
      ? isAgrario
        ? 'bg-[#B45309] text-white hover:bg-[#92400E] active:bg-[#78350F] focus-visible:ring-[#B45309]/40'
        : 'bg-[#2E7D32] text-white hover:bg-[#256829] active:bg-[#1E5220] focus-visible:ring-[#2E7D32]/40'
      : isAgrario
        ? 'border border-[#B45309] bg-white text-[#B45309] hover:bg-[#FEF3C7] active:bg-[#FDE68A]'
        : 'border border-[#2E7D32] bg-white text-[#2E7D32] hover:bg-[#E9F1EA] active:bg-[#D5E4D7]'

  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-[38px] min-w-[140px] items-center justify-center gap-2 rounded-[8px] px-5 text-[15px] font-medium',
        'transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClass,
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {withArrow && <ArrowRightIcon className="h-4 w-4 stroke-[2.5]" />}
    </button>
  )
}

