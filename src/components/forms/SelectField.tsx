import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FieldCopy, Option } from '../../types/form'
import { cn } from '../../utils/cn'
import { ChevronDownIcon } from '../ui/icons'
import { fieldBaseClasses } from '../ui/Input'
import type { SelectOption } from '../ui/Select'
import { FieldLabel, Text } from '../ui/Typography'

export interface SelectFieldProps<TValues extends FieldValues> {
  control: Control<TValues>
  name: FieldPath<TValues>
  options: readonly (Option | SelectOption)[]
  copy?: FieldCopy
  label?: string
  required?: boolean
  placeholder?: string
  helperText?: ReactNode
  className?: string
  disabled?: boolean
  onChangeValue?: (val: string) => void
}

/**
 * Campo Select customizado com hover verde (#E9F1EA / #2E7D32) em cada item
 * e na borda do gatilho, integrado ao React Hook Form.
 */
export function SelectField<TValues extends FieldValues>({
  control,
  name,
  options,
  copy,
  label,
  required,
  placeholder: placeholderProp,
  helperText,
  className,
  disabled = false,
  onChangeValue,
}: SelectFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name })
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const autoId = useId()
  const inputId = `${String(name)}-${autoId}`
  const describedById = `${inputId}-desc`

  const resolvedLabel = label ?? copy?.label
  const resolvedRequired = required ?? copy?.required ?? false
  const resolvedHelper = helperText ?? copy?.helperText
  const resolvedPlaceholder = placeholderProp ?? copy?.placeholder ?? 'Selecione uma opção'
  const errorMessage = fieldState.error?.message
  const hasDescription = errorMessage != null || resolvedHelper != null

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedOption = options.find((o) => o.value === field.value)

  const handleSelect = (val: string) => {
    field.onChange(val)
    onChangeValue?.(val)
    setIsOpen(false)
  }

  return (
    <div className={cn('flex flex-col', className)} ref={containerRef}>
      {resolvedLabel != null && (
        <FieldLabel htmlFor={inputId} required={resolvedRequired}>
          {resolvedLabel}
        </FieldLabel>
      )}

      <div className={cn('relative w-full', resolvedLabel != null && 'mt-1.5')}>
          <button
          type="button"
          id={inputId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            fieldBaseClasses,
            'flex items-center justify-between text-left cursor-pointer pr-3.5 transition-all select-none',
            'hover:border-[#2E7D32] hover:ring-2 hover:ring-[#2E7D32]/15',
            !field.value && 'text-[#888888]',
            disabled && 'opacity-50 cursor-not-allowed hover:border-[#4B4B4B]',
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={fieldState.invalid || undefined}
          aria-describedby={hasDescription ? describedById : undefined}
        >
          <span className="truncate pr-2">
            {selectedOption ? selectedOption.label : resolvedPlaceholder}
          </span>
          <span
            className={cn(
              'pointer-events-none transition-transform duration-200 text-[#555555]',
              isOpen && 'rotate-180 text-[#2E7D32]',
            )}
          >
            <ChevronDownIcon />
          </span>
        </button>

        {isOpen && (
          <ul
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-[8px] border border-[#D5D5D5] bg-white py-1 shadow-lg"
          >
            {options.map((opt) => {
              const isSelected = opt.value === field.value

              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    'group flex items-center px-4 py-2.5 text-[14px] cursor-pointer select-none transition-colors duration-150',
                    'hover:bg-[#2E7D32] hover:text-white',
                    isSelected ? 'bg-[#E9F1EA] font-semibold text-[#2E7D32]' : 'text-[#222222]',
                  )}
                >
                  <span className="flex-1">{opt.label}</span>
                  {isSelected && (
                    <span className="text-[13px] font-bold group-hover:text-white text-[#2E7D32]">✓</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {hasDescription && (
        <Text
          id={describedById}
          variant={errorMessage != null ? 'caption' : 'helper'}
          role={errorMessage != null ? 'alert' : undefined}
          className={cn('mt-1', errorMessage != null && 'text-[#D32F2F]')}
        >
          {errorMessage ?? resolvedHelper}
        </Text>
      )}
    </div>
  )
}
