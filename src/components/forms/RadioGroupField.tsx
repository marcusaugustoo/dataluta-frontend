import { useId, type ReactNode } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FieldCopy, Option } from '../../types/form'
import { cn } from '../../utils/cn'
import { FieldLabel, Text } from '../ui/Typography'

export interface RadioGroupFieldProps<TValues extends FieldValues> {
  control: Control<TValues>
  name: FieldPath<TValues>
  options: readonly Option[]
  copy?: FieldCopy
  label?: string
  required?: boolean
  helperText?: ReactNode
  className?: string
}

/**
 * Grupo de Radio Buttons fiel ao design (círculos 20px, texto 16px).
 */
export function RadioGroupField<TValues extends FieldValues>({
  control,
  name,
  options,
  copy,
  label,
  required,
  helperText,
  className,
}: RadioGroupFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name })
  const autoId = useId()
  const groupId = `${String(name)}-${autoId}`
  const describedById = `${groupId}-desc`

  const resolvedLabel = label ?? copy?.label
  const resolvedRequired = required ?? copy?.required ?? false
  const resolvedHelper = helperText ?? copy?.helperText
  const errorMessage = fieldState.error?.message
  const hasDescription = errorMessage != null || resolvedHelper != null

  return (
    <fieldset className={cn('flex flex-col', className)} aria-describedby={hasDescription ? describedById : undefined}>
      {resolvedLabel != null && (
        <legend className="mb-label-gap">
          <FieldLabel required={resolvedRequired}>{resolvedLabel}</FieldLabel>
        </legend>
      )}

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {options.map((opt) => {
          const isSelected = field.value === opt.value
          const optionId = `${groupId}-${opt.value}`

          return (
            <label
              key={opt.value}
              htmlFor={optionId}
              className="inline-flex cursor-pointer items-center gap-3 select-none"
            >
              <input
                type="radio"
                id={optionId}
                name={field.name}
                value={opt.value}
                checked={isSelected}
                onChange={() => field.onChange(opt.value)}
                onBlur={field.onBlur}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border border-ink transition-colors',
                  isSelected && 'border-brand',
                )}
                aria-hidden="true"
              >
                {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
              </span>
              <span className="text-body text-ink">{opt.label}</span>
            </label>
          )
        })}
      </div>

      {hasDescription && (
        <Text
          id={describedById}
          variant={errorMessage != null ? 'caption' : 'helper'}
          role={errorMessage != null ? 'alert' : undefined}
          className={cn('mt-[6px]', errorMessage != null && 'text-danger')}
        >
          {errorMessage ?? resolvedHelper}
        </Text>
      )}
    </fieldset>
  )
}
