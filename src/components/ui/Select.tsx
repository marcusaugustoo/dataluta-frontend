import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'
import { fieldBaseClasses } from './Input'
import { ChevronDownIcon } from './icons'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<ComponentProps<'select'>, 'children'> {
  options: readonly SelectOption[]
  placeholder?: string
  containerClassName?: string
}

/**
 * Select padronizado com 42px de altura, cantos rounded-[8px] e borda #4B4B4B.
 */
export function Select({
  options,
  placeholder,
  className,
  containerClassName,
  disabled,
  value,
  ...props
}: SelectProps) {
  const isPlaceholderSelected = !value || value === ''

  return (
    <div className={cn('relative w-full', containerClassName)}>
      <select
        value={value}
        disabled={disabled}
        className={cn(
          fieldBaseClasses,
          'appearance-none pr-10 cursor-pointer bg-white',
          isPlaceholderSelected && 'text-[#888888]',
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className="text-[#888888]">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-[#222222]">
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-[#555555]">
        <ChevronDownIcon />
      </span>
    </div>
  )
}
