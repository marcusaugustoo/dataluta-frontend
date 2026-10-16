import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

/** Estilo padronizado dos campos: altura 42px, cantos rounded-[8px], borda #4B4B4B. */
export const fieldBaseClasses =
  'w-full h-[42px] rounded-[8px] border border-[#4B4B4B] bg-white px-3.5 text-[15px] text-[#222222] ' +
  'placeholder:text-[#888888] transition-colors duration-150 ' +
  'focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] ' +
  'disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#888888] ' +
  'aria-[invalid=true]:border-[#D32F2F] aria-[invalid=true]:focus:ring-[#D32F2F]'

export interface InputProps extends ComponentProps<'input'> {
  rightIcon?: ReactNode
  containerClassName?: string
}

export function Input({ className, containerClassName, rightIcon, ...props }: InputProps) {
  return (
    <div className={cn('relative w-full', containerClassName)}>
      <input
        className={cn(fieldBaseClasses, rightIcon != null && 'pr-11', className)}
        {...props}
      />
      {rightIcon != null && (
        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-[#555555]">
          {rightIcon}
        </span>
      )}
    </div>
  )
}

export type TextareaProps = ComponentProps<'textarea'>

export function Textarea({ className, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        fieldBaseClasses,
        'h-auto min-h-[90px] resize-y py-2.5',
        className,
      )}
      {...props}
    />
  )
}
