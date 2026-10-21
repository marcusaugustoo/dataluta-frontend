import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy, options } from '../../data/agrarioData'
import {
  movimentoSchema,
  type AgrarioMovimentoFormInput,
  type AgrarioMovimentoFormValues,
} from '../../schemas/agrarioSchemas'
import { MultiSelectDropdownField } from '../../../components/forms/MultiSelectDropdownField'
import { TextField } from '../../../components/forms/TextField'
import { RequiredLegend } from '../../../components/ui/Typography'

export const AGRARIO_MOVIMENTO_FORM_ID = 'agrario-movimento-form'

interface AgrarioMovimentoStepFormProps {
  defaultValues?: Partial<AgrarioMovimentoFormInput>
  onValid: (values: AgrarioMovimentoFormValues) => void
}

const t = copy.movimento


export function AgrarioMovimentoStepForm({
  defaultValues,
  onValid,
}: AgrarioMovimentoStepFormProps) {
  const { control, handleSubmit } = useForm<
    AgrarioMovimentoFormInput,
    unknown,
    AgrarioMovimentoFormValues
  >({
    resolver: zodResolver(movimentoSchema),
    mode: 'onTouched',
    defaultValues: {
      tipos: [],
      outroTipo: '',
      nomes: [],
      novoMovimento: '',
      modalidadeMovimento: [],
      quantidadePessoas: 0,
      quantidadeFamilias: 0,
      ...defaultValues,
    },
  })

  return (
    <form
      id={AGRARIO_MOVIMENTO_FORM_ID}
      noValidate
      onSubmit={handleSubmit(onValid)}
      className="space-y-4"
    >
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      <MultiSelectDropdownField
        control={control}
        name="tipos"
        copy={t.tipo}
        options={options.tiposMovimento}
        placeholder="Selecione os tipos de movimento"
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

      <MultiSelectDropdownField
        control={control}
        name="modalidadeMovimento"
        copy={t.modalidadeMovimento}
        options={options.modalidadeMovimento}
        placeholder="Selecione as modalidades"
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
