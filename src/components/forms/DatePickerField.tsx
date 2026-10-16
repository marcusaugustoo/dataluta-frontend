import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FieldCopy } from '../../types/form'
import { cn } from '../../utils/cn'
import { CalendarIcon } from '../ui/icons'
import { fieldBaseClasses } from '../ui/Input'
import { FieldLabel, Text } from '../ui/Typography'

export interface DatePickerFieldProps<TValues extends FieldValues> {
  control: Control<TValues>
  name: FieldPath<TValues>
  copy?: FieldCopy
  label?: string
  required?: boolean
  helperText?: string
  className?: string
  placeholder?: string
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Anos de 1950 a 2035 para seleção rápida
const YEARS = Array.from({ length: 86 }, (_, i) => 1950 + i)

function toDisplayFormat(val: string | undefined): string {
  if (!val) return ''
  const trimmed = val.trim()
  if (trimmed.includes('-')) {
    const parts = trimmed.split('-')
    if (parts.length === 3) {
      return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`
    }
  }
  return trimmed
}

function parseToDate(val: string | undefined): Date | null {
  if (!val) return null
  const trimmed = val.trim()
  if (trimmed.includes('-')) {
    const [y, m, d] = trimmed.split('-').map(Number)
    if (y && m && d) return new Date(y, m - 1, d)
  }
  if (trimmed.includes('/')) {
    const [d, m, y] = trimmed.split('/').map(Number)
    if (y && m && d) return new Date(y, m - 1, d)
  }
  return null
}

/**
 * Campo de data com popover de calendário interativo com navegação de mês e ano,
 * suporte a digitação manual com máscara dd/mm/aaaa e seleção visual do dia.
 */
export function DatePickerField<TValues extends FieldValues>({
  control,
  name,
  copy,
  label,
  required,
  helperText,
  className,
  placeholder = 'dd/mm/aaaa',
}: DatePickerFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name })
  const [isOpen, setIsOpen] = useState(false)
  const [textValue, setTextValue] = useState(() => toDisplayFormat(field.value))

  const today = new Date()

  // Sincroniza viewDate com o valor atual ou hoje
  const [viewDate, setViewDate] = useState<Date>(() => {
    const parsed = parseToDate(field.value)
    return parsed && !isNaN(parsed.getTime()) ? parsed : today
  })

  // Sincroniza textValue se o valor do react-hook-form mudar externamente
  useEffect(() => {
    const formatted = toDisplayFormat(field.value)
    setTextValue(formatted)
    const parsed = parseToDate(field.value)
    if (parsed && !isNaN(parsed.getTime())) {
      setViewDate(parsed)
    }
  }, [field.value])

  const containerRef = useRef<HTMLDivElement>(null)
  const autoId = useId()
  const inputId = `${String(name)}-${autoId}`
  const describedById = `${inputId}-desc`

  const resolvedLabel = label ?? copy?.label
  const resolvedRequired = required ?? copy?.required ?? false
  const resolvedHelper = helperText ?? copy?.helperText
  const errorMessage = fieldState.error?.message
  const hasDescription = errorMessage != null || resolvedHelper != null

  // Fecha calendário ao clicar fora
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

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleMonthChange = (newMonth: number) => {
    setViewDate(new Date(year, newMonth, 1))
  }

  const handleYearChange = (newYear: number) => {
    setViewDate(new Date(newYear, month, 1))
  }

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0')
    const formattedDay = String(day).padStart(2, '0')
    const isoString = `${year}-${formattedMonth}-${formattedDay}`
    const displayString = `${formattedDay}/${formattedMonth}/${year}`
    setTextValue(displayString)
    field.onChange(isoString)
    setIsOpen(false)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    let formatted = raw
    if (raw.length > 2 && raw.length <= 4) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`
    } else if (raw.length > 4) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4, 8)}`
    }
    setTextValue(formatted)

    if (raw.length === 8) {
      const d = parseInt(raw.slice(0, 2), 10)
      const m = parseInt(raw.slice(2, 4), 10)
      const y = parseInt(raw.slice(4, 8), 10)
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        field.onChange(iso)
        setViewDate(new Date(y, m - 1, d))
      }
    } else if (raw.length === 0) {
      field.onChange('')
    }
  }

  const selectedParsed = parseToDate(field.value)

  return (
    <div className={cn('flex flex-col', className)} ref={containerRef}>
      {resolvedLabel != null && (
        <FieldLabel htmlFor={inputId} required={resolvedRequired}>
          {resolvedLabel}
        </FieldLabel>
      )}

      <div className={cn('relative w-full', resolvedLabel != null && 'mt-1.5')}>
        <div className="relative flex items-center">
          <input
            id={inputId}
            type="text"
            value={textValue}
            onChange={handleInputChange}
            onClick={() => setIsOpen(true)}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid || undefined}
            aria-describedby={hasDescription ? describedById : undefined}
            className={cn(
              fieldBaseClasses,
              'w-full pr-10 cursor-pointer select-none transition-all',
              'hover:border-[#2E7D32] hover:ring-2 hover:ring-[#2E7D32]/15',
              !textValue && 'placeholder:text-[#888888]',
            )}
          />
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="absolute right-3 text-[#555555] hover:text-[#2E7D32] transition-colors cursor-pointer p-1"
            title="Abrir calendário"
            aria-label="Abrir calendário"
          >
            <CalendarIcon />
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-[310px] rounded-[12px] border border-[#D5D5D5] bg-white p-3.5 shadow-2xl animate-fadeIn">
            {/* Cabeçalho do mês com navegação e seleção rápida de mês e ano */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#F0F0F0] gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#555555] hover:bg-[#E9F1EA] hover:text-[#2E7D32] transition-colors cursor-pointer shrink-0 font-bold"
                aria-label="Mês anterior"
                title="Mês anterior"
              >
                ‹
              </button>

              <div className="flex items-center gap-1.5 flex-1 justify-center">
                <select
                  value={month}
                  onChange={(e) => handleMonthChange(Number(e.target.value))}
                  className="rounded-md border border-[#E0E0E0] bg-white px-2 py-1 text-[13px] font-semibold text-[#17301D] hover:border-[#2E7D32] focus:outline-hidden focus:ring-1 focus:ring-[#2E7D32] cursor-pointer"
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={name} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="rounded-md border border-[#E0E0E0] bg-white px-2 py-1 text-[13px] font-semibold text-[#17301D] hover:border-[#2E7D32] focus:outline-hidden focus:ring-1 focus:ring-[#2E7D32] cursor-pointer"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#555555] hover:bg-[#E9F1EA] hover:text-[#2E7D32] transition-colors cursor-pointer shrink-0 font-bold"
                aria-label="Próximo mês"
                title="Próximo mês"
              >
                ›
              </button>
            </div>

            {/* Cabeçalho dos dias da semana */}
            <div className="grid grid-cols-7 gap-1 pt-2.5 pb-1 text-center text-[11px] font-semibold text-[#757575]">
              {DAY_NAMES.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Grid dos dias do mês */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-7 w-7" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const isSelected =
                  selectedParsed !== null &&
                  selectedParsed.getDate() === day &&
                  selectedParsed.getMonth() === month &&
                  selectedParsed.getFullYear() === year

                const isToday =
                  today.getDate() === day &&
                  today.getMonth() === month &&
                  today.getFullYear() === year

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-medium transition-colors cursor-pointer mx-auto',
                      isSelected
                        ? 'bg-[#2E7D32] text-white font-bold shadow-xs'
                        : isToday
                          ? 'border border-[#2E7D32] text-[#2E7D32] font-semibold hover:bg-[#2E7D32] hover:text-white'
                          : 'text-[#333333] hover:bg-[#2E7D32] hover:text-white',
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            {/* Rodapé com atalhos Hoje e Limpar */}
            <div className="mt-2.5 pt-2 border-t border-[#F0F0F0] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  field.onChange('')
                  setTextValue('')
                  setIsOpen(false)
                }}
                className="text-[11px] font-medium text-[#757575] hover:text-[#D32F2F] hover:underline cursor-pointer"
              >
                Limpar data
              </button>
              <button
                type="button"
                onClick={() => {
                  const m = String(today.getMonth() + 1).padStart(2, '0')
                  const d = String(today.getDate()).padStart(2, '0')
                  const y = today.getFullYear()
                  field.onChange(`${y}-${m}-${d}`)
                  setTextValue(`${d}/${m}/${y}`)
                  setViewDate(today)
                  setIsOpen(false)
                }}
                className="text-[11px] font-semibold text-[#2E7D32] hover:underline cursor-pointer"
              >
                Selecionar Hoje
              </button>
            </div>
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
