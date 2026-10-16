import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type TextVariant =
  | 'display'
  | 'subtitle'
  | 'section'
  | 'label'
  | 'body'
  | 'helper'
  | 'caption'
  | 'micro'

const variantClasses: Record<TextVariant, string> = {
  display: 'font-display text-[26px] font-bold text-[#222222]',
  subtitle: 'text-[15px] text-[#666666]',
  section: 'text-[18px] font-bold text-[#222222]',
  label: 'text-[16px] font-medium text-[#222222]',
  body: 'text-[15px] text-[#333333]',
  helper: 'text-[12px] font-normal text-[#666666]',
  caption: 'text-[11px] text-[#666666]',
  micro: 'text-[10px] text-[#777777]',
}

const defaultElement: Record<TextVariant, ElementType> = {
  display: 'h1',
  subtitle: 'p',
  section: 'h2',
  label: 'span',
  body: 'p',
  helper: 'p',
  caption: 'p',
  micro: 'p',
}

type TextProps<T extends ElementType> = {
  as?: T
  variant?: TextVariant
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

export function Text<T extends ElementType = 'p'>({
  as,
  variant = 'body',
  className,
  children,
  ...rest
}: TextProps<T>) {
  const Component: ElementType = as ?? defaultElement[variant]
  return (
    <Component className={cn(variantClasses[variant], className)} {...rest}>
      {children}
    </Component>
  )
}

/** Asterisco vermelho de campo obrigatório. */
export function RequiredMark({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('ml-1 text-[#D32F2F] font-bold', className)}>
      *
    </span>
  )
}

interface FieldLabelProps {
  htmlFor?: string
  required?: boolean
  className?: string
  children: ReactNode
}

export function FieldLabel({ htmlFor, required = false, className, children }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className={cn('block text-[16px] font-medium text-[#222222]', className)}>
      {children}
      {required && <RequiredMark />}
      {required && <span className="sr-only"> (obrigatório)</span>}
    </label>
  )
}

/** Legenda "* Campo obrigatório" no topo. */
export function RequiredLegend({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] text-[#757575] font-normal">
      <span aria-hidden="true" className="mr-1 text-[#D32F2F] font-bold">
        *
      </span>
      {children}
    </p>
  )
}
