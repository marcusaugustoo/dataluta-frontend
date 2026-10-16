import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FieldCopy, Option } from '../../types/form'
import { cn } from '../../utils/cn'
import { fieldBaseClasses } from '../ui/Input'
import { ChevronDownIcon } from '../ui/icons'
import { FieldLabel, Text } from '../ui/Typography'

export interface MultiSelectDropdownFieldProps<TValues extends FieldValues> {
  control: Control<TValues>
  name: FieldPath<TValues>
  options: readonly Option[]
  copy?: FieldCopy
  label?: string
  required?: boolean
  placeholder?: string
  helperText?: ReactNode
  className?: string
  maxHeight?: string
}

/**
 * Dropdown de seleção múltipla padronizado (42px de altura, cantos rounded-[8px]).
 */
export function MultiSelectDropdownField<TValues extends FieldValues>({
  control,
  name,
  options,
  copy,
  label,
  required,
  placeholder: placeholderProp,
  helperText,
  className,
  maxHeight = 'max-h-60',
}: MultiSelectDropdownFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name })
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const autoId = useId()
  const inputId = `${String(name)}-${autoId}`
  const describedById = `${inputId}-desc`

  const resolvedLabel = label ?? copy?.label
  const resolvedRequired = required ?? copy?.required ?? false
  const resolvedHelper = helperText ?? copy?.helperText
  const resolvedPlaceholder = placeholderProp ?? copy?.placeholder ?? 'Escolha uma opção'
  const errorMessage = fieldState.error?.message
  const hasDescription = errorMessage != null || resolvedHelper != null

  const selectedValues: string[] = Array.isArray(field.value) ? field.value : []

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

  const toggleOption = (val: string) => {
    const isSelected = selectedValues.includes(val)
    let newValues: string[]

    if (isSelected) {
      newValues = selectedValues.filter((v) => v !== val)
    } else {
      newValues = [...selectedValues, val]
    }

    field.onChange(newValues)
  }

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return resolvedPlaceholder
    }
    if (selectedValues.length === 1) {
      const match = options.find((o) => o.value === selectedValues[0])
      return match ? match.label : selectedValues[0]
    }
    return `${selectedValues.length} selecionados`
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
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            fieldBaseClasses,
            'flex items-center justify-between text-left cursor-pointer pr-4 transition-all',
            'hover:border-[#2E7D32] hover:ring-2 hover:ring-[#2E7D32]/15',
            selectedValues.length === 0 && 'text-[#888888]',
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={fieldState.invalid || undefined}
          aria-describedby={hasDescription ? describedById : undefined}
        >
          <span className="truncate pr-2">{getDisplayText()}</span>
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
            aria-multiselectable="true"
            className={cn(
              'absolute z-50 mt-1 w-full overflow-y-auto rounded-[8px] border border-[#D5D5D5] bg-white py-1 shadow-lg',
              maxHeight,
            )}
          >
            {options.map((opt) => {
              const isChecked = selectedValues.includes(opt.value)
              const checkId = `${inputId}-${opt.value}`

              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isChecked}
                  className={cn(
                    'flex items-center px-4 py-2 cursor-pointer select-none transition-colors duration-100',
                    'hover:bg-[#E9F1EA] hover:text-[#2E7D32]',
                    isChecked ? 'bg-[#F2F7F3]' : '',
                  )}
                  onClick={() => toggleOption(opt.value)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="checkbox"
                      id={checkId}
                      checked={isChecked}
                      onChange={() => {}}
                      className="h-4 w-4 rounded border-[#4B4B4B] text-[#2E7D32] focus:ring-[#2E7D32]/20 accent-[#2E7D32] cursor-pointer"
                    />
                    <label
                      htmlFor={checkId}
                      className={cn(
                        'text-[14px] cursor-pointer flex-1',
                        isChecked ? 'font-semibold text-[#17301D]' : 'text-[#222222]',
                      )}
                    >
                      {opt.label}
                    </label>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {/* Tags visíveis com os itens selecionados para o profissional não se perder */}
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {selectedValues.map((val) => {
              const opt = options.find((o) => o.value === val)
              const label = opt ? opt.label : val
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#2E7D32]/30 bg-[#E9F1EA] px-2.5 py-1 text-[12px] font-medium text-[#17301D] shadow-xs"
                >
                  <span className="truncate max-w-[280px]">{label}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleOption(val)
                    }}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-colors cursor-pointer text-[13px] leading-none"
                    aria-label={`Remover ${label}`}
                    title={`Remover ${label}`}
                  >
                    ×
                  </button>
                </span>
              )
            })}
            {selectedValues.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  field.onChange([])
                }}
                className="text-[11px] font-medium text-[#757575] hover:text-[#D32F2F] hover:underline cursor-pointer px-1 py-0.5 ml-1"
              >
                Limpar seleção
              </button>
            )}
          </div>
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
