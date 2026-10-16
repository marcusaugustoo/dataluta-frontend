import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'
import { ArrowRightIcon } from './icons'

type ButtonVariant = 'primary' | 'outline'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  withArrow?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[#2E7D32] text-white hover:bg-[#256829] active:bg-[#1E5220]',
  outline: 'border border-[#2E7D32] bg-white text-[#2E7D32] hover:bg-[#E9F1EA] active:bg-[#D5E4D7]',
}

export function Button({
  variant = 'primary',
  withArrow = false,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-[38px] min-w-[140px] items-center justify-center gap-2 rounded-[8px] px-5 text-[15px] font-medium',
        'transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {withArrow && <ArrowRightIcon className="h-4 w-4 stroke-[2.5]" />}
    </button>
  )
}
