import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy, options } from '../../data/florestaData'
import { pautaSchema, type PautaFormInput, type PautaFormValues } from '../../schemas/florestaSchemas'
import { RequiredLegend } from '../../../components/ui/Typography'
import { MultiSelectDropdownField } from '../../../components/forms/MultiSelectDropdownField'
import { TextField } from '../../../components/forms/TextField'

export const PAUTA_FORM_ID = 'floresta-pauta-form'

interface FlorestaPautaStepFormProps {
  defaultValues?: Partial<PautaFormInput>
  onValid: (values: PautaFormValues) => void
}

const t = copy.pauta

export function FlorestaPautaStepForm({ defaultValues, onValid }: FlorestaPautaStepFormProps) {
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

      <MultiSelectDropdownField
        control={control}
        name="pautasAmplas"
        copy={t.pautasAmplas}
        options={options.pautasAmplas}
        placeholder="Selecione as pautas amplas"
      />

      <TextField
        control={control}
        name="pautaEspecifica"
        copy={t.pautaEspecifica}
      />
    </form>
  )
}

export const PautaStepForm = FlorestaPautaStepForm
