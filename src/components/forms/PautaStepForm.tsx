import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy, options } from '../../data/mockData'
import { pautaSchema, type PautaFormInput, type PautaFormValues } from '../../schemas/noticiaSchemas'
import { RequiredLegend } from '../ui/Typography'
import { MultiSelectDropdownField } from './MultiSelectDropdownField'
import { TextField } from './TextField'

export const PAUTA_FORM_ID = 'pauta-form'

interface PautaStepFormProps {
  defaultValues?: Partial<PautaFormInput>
  onValid: (values: PautaFormValues) => void
}

const t = copy.pauta

/** Etapa 5 — Pauta com espaçamento padronizado de 16px (space-y-4). */
export function PautaStepForm({ defaultValues, onValid }: PautaStepFormProps) {
  const { control, handleSubmit } = useForm<PautaFormInput, unknown, PautaFormValues>({
    resolver: zodResolver(pautaSchema),
    mode: 'onTouched',
    defaultValues: {
      pautasAmplas: [],
      pautaEspecifica: '',
      ...defaultValues,
    },
  })

  return (
    <form id={PAUTA_FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className="space-y-4">
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      {/* Pautas amplas */}
      <MultiSelectDropdownField
        control={control}
        name="pautasAmplas"
        copy={t.pautasAmplas}
        options={options.pautasAmplas}
        placeholder="Selecione as pautas amplas"
      />

      {/* Pauta específica (16px) */}
      <TextField
        control={control}
        name="pautaEspecifica"
        copy={t.pautaEspecifica}
      />
    </form>
  )
}
