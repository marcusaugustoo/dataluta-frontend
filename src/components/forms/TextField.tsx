import { useId, type ReactNode } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FieldCopy } from '../../types/form'
import { cn } from '../../utils/cn'
import { Input, Textarea, type InputProps, type TextareaProps } from '../ui/Input'
import { FieldLabel, Text } from '../ui/Typography'

interface BaseFieldProps<TValues extends FieldValues> {
  control: Control<TValues>
  name: FieldPath<TValues>
  /** Atalho: passa label/required/placeholder/helperText direto do mockData. */
  copy?: FieldCopy
  label?: string
  /** Label secundária, regular (ex.: "Nome" / "Sobrenome" no Login). */
  sublabel?: string
  required?: boolean
  helperText?: ReactNode
  className?: string
  inputClassName?: string
  labelClassName?: string
}

type InputFieldProps<TValues extends FieldValues> = BaseFieldProps<TValues> & {
  multiline?: false
} & Omit<InputProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'ref' | 'required'>

type TextareaFieldProps<TValues extends FieldValues> = BaseFieldProps<TValues> & {
  multiline: true
} & Omit<TextareaProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'ref' | 'required'>

export type TextFieldProps<TValues extends FieldValues> =
  | InputFieldProps<TValues>
  | TextareaFieldProps<TValues>

/**
 * Campo de texto integrado ao React Hook Form via `useController`.
 * Renderiza label (+ asterisco), sublabel, input/textarea e helper/erro.
 */
export function TextField<TValues extends FieldValues>(props: TextFieldProps<TValues>) {
  const {
    control,
    name,
    copy,
    label,
    sublabel,
    required,
    helperText,
    className,
    inputClassName,
    labelClassName,
    multiline,
    placeholder: placeholderProp,
    ...rest
  } = props
  const placeholder = placeholderProp ?? copy?.placeholder

  const { field, fieldState } = useController({ control, name })
  const autoId = useId()
  const inputId = `${String(name)}-${autoId}`
  const describedById = `${inputId}-desc`

  const resolvedLabel = label ?? copy?.label
  const resolvedRequired = required ?? copy?.required ?? false
  const resolvedHelper = helperText ?? copy?.helperText
  const errorMessage = fieldState.error?.message
  const hasDescription = errorMessage != null || resolvedHelper != null

  const sharedProps = {
    id: inputId,
    name: field.name,
    onBlur: field.onBlur,
    'aria-invalid': fieldState.invalid || undefined,
    'aria-required': resolvedRequired || undefined,
    'aria-describedby': hasDescription ? describedById : undefined,
  } as const

  const value = (field.value ?? '') as string | number

  return (
    <div className={cn('flex flex-col', className)}>
      {resolvedLabel != null && (
        <FieldLabel
          htmlFor={sublabel ? undefined : inputId}
          required={resolvedRequired}
          className={labelClassName}
        >
          {resolvedLabel}
        </FieldLabel>
      )}

      {sublabel != null && (
        <label htmlFor={inputId} className={cn('text-body text-ink', resolvedLabel != null && 'mt-[6px]')}>
          {sublabel}
        </label>
      )}

      <div className={cn((resolvedLabel != null || sublabel != null) && 'mt-label-gap')}>
        {multiline === true ? (
          <Textarea
            {...(rest as Omit<TextareaProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'ref' | 'required'>)}
            {...sharedProps}
            ref={field.ref}
            value={value}
            placeholder={placeholder}
            className={inputClassName}
            onChange={(e) => field.onChange(e.target.value)}
          />
        ) : (
          <Input
            {...(rest as Omit<InputProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'ref' | 'required'>)}
            {...sharedProps}
            ref={field.ref}
            value={value}
            placeholder={placeholder}
            className={inputClassName}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
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
    </div>
  )
}
