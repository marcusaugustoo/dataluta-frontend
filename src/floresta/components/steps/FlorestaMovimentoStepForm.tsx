import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy, options } from '../../data/florestaData'
import { movimentoSchema, type MovimentoFormInput, type MovimentoFormValues } from '../../schemas/florestaSchemas'
import { RequiredLegend } from '../../../components/ui/Typography'
import { MultiSelectDropdownField } from '../../../components/forms/MultiSelectDropdownField'
import { RadioGroupField } from '../../../components/forms/RadioGroupField'
import { TextField } from '../../../components/forms/TextField'

export const MOVIMENTO_FORM_ID = 'floresta-movimento-form'

interface FlorestaMovimentoStepFormProps {
  defaultValues?: Partial<MovimentoFormInput>
  onValid: (values: MovimentoFormValues) => void
}

const t = copy.movimento

export function FlorestaMovimentoStepForm({ defaultValues, onValid }: FlorestaMovimentoStepFormProps) {
  const { control, handleSubmit } = useForm<MovimentoFormInput, unknown, MovimentoFormValues>({
    resolver: zodResolver(movimentoSchema),
    mode: 'onTouched',
    defaultValues: {
      tipos: [],
      outroTipo: '',
      nomes: [],
      novoMovimento: '',
      lupemOposicao: undefined,
      quantidadePessoas: 0,
      quantidadeFamilias: 0,
      ...defaultValues,
    },
  })

  return (
    <form id={MOVIMENTO_FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className="space-y-4">
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      <MultiSelectDropdownField
        control={control}
        name="tipos"
        copy={t.tipo}
        options={options.tiposMovimento}
        placeholder="Selecione os tipos"
      />

      <TextField
        control={control}
        name="outroTipo"
        copy={t.outroTipo}
      />

      <MultiSelectDropdownField
        control={control}
        name="nomes"
        copy={t.nome}
        options={options.nomesMovimento}
        placeholder="Selecionar movimentos"
      />

      <TextField
        control={control}
        name="novoMovimento"
        copy={t.novoMovimento}
      />

      <RadioGroupField
        control={control}
        name="lupemOposicao"
        copy={t.lupem}
        options={options.lupemOposicao}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          control={control}
          name="quantidadePessoas"
          copy={t.quantidadePessoas}
          type="number"
          min={0}
        />
        <TextField
          control={control}
          name="quantidadeFamilias"
          copy={t.quantidadeFamilias}
          type="number"
          min={0}
        />
      </div>
    </form>
  )
}

export const MovimentoStepForm = FlorestaMovimentoStepForm
