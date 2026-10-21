import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy, options } from '../../data/agrarioData'
import {
  pautaSchema,
  type AgrarioPautaFormInput,
  type AgrarioPautaFormValues,
} from '../../schemas/agrarioSchemas'
import { MultiSelectDropdownField } from '../../../components/forms/MultiSelectDropdownField'
import { TextField } from '../../../components/forms/TextField'
import { RequiredLegend } from '../../../components/ui/Typography'

export const AGRARIO_PAUTA_FORM_ID = 'agrario-pauta-form'

interface AgrarioPautaStepFormProps {
  defaultValues?: Partial<AgrarioPautaFormInput>
  onValid: (values: AgrarioPautaFormValues) => void
}

const t = copy.pauta


export function AgrarioPautaStepForm({
  defaultValues,
  onValid,
}: AgrarioPautaStepFormProps) {
  const { control, handleSubmit } = useForm<
    AgrarioPautaFormInput,
    unknown,
    AgrarioPautaFormValues
  >({
    resolver: zodResolver(pautaSchema),
    mode: 'onTouched',
    defaultValues: {
      pautaAcao: [],
      pautaEspecifica: '',
      ...defaultValues,
    },
  })

  return (
    <form
      id={AGRARIO_PAUTA_FORM_ID}
      noValidate
      onSubmit={handleSubmit(onValid)}
      className="space-y-4"
    >
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      <MultiSelectDropdownField
        control={control}
        name="pautaAcao"
        copy={t.pautaAcao}
        options={options.pautasAcao}
        placeholder="Selecione as pautas da ação"
      />

      <TextField
        control={control}
        name="pautaEspecifica"
        copy={t.pautaEspecifica}
      />
    </form>
  )
}
