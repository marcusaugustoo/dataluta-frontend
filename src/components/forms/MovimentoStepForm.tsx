import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy, options } from '../../data/mockData'
import { movimentoSchema, type MovimentoFormInput, type MovimentoFormValues } from '../../schemas/noticiaSchemas'
import { RequiredLegend } from '../ui/Typography'
import { MultiSelectDropdownField } from './MultiSelectDropdownField'
import { RadioGroupField } from './RadioGroupField'
import { TextField } from './TextField'

export const MOVIMENTO_FORM_ID = 'movimento-form'

interface MovimentoStepFormProps {
  defaultValues?: Partial<MovimentoFormInput>
  onValid: (values: MovimentoFormValues) => void
}

const t = copy.movimento

/** Etapa 6 — Movimento com espaçamento padronizado de 16px (space-y-4 / gap-4). */
export function MovimentoStepForm({ defaultValues, onValid }: MovimentoStepFormProps) {
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

      {/* Tipo de movimento */}
      <MultiSelectDropdownField
        control={control}
        name="tipos"
        copy={t.tipo}
        options={options.tiposMovimento}
        placeholder="Selecione os tipos"
      />

      {/* Outro tipo de movimento (16px) */}
      <TextField
        control={control}
        name="outroTipo"
        copy={t.outroTipo}
      />

      {/* Nome do movimento (16px) */}
      <MultiSelectDropdownField
        control={control}
        name="nomes"
        copy={t.nome}
        options={options.nomesMovimento}
        placeholder="Selecionar movimentos"
      />

      {/* Cadastrar novo movimento (16px) */}
      <TextField
        control={control}
        name="novoMovimento"
        copy={t.novoMovimento}
      />

      {/* Lupem/Oposição intraclasse (16px) */}
      <RadioGroupField
        control={control}
        name="lupemOposicao"
        copy={t.lupem}
        options={options.lupemOposicao}
      />

      {/* Quantidades lado a lado (16px de diferença: gap-4) */}
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
