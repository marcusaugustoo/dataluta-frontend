import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { brand, copy, options } from '../../data/mockData'
import { acaoSchema, type AcaoFormInput, type AcaoFormValues } from '../../schemas/noticiaSchemas'
import { FieldLabel, RequiredLegend } from '../ui/Typography'
import { DatePickerField } from './DatePickerField'
import { MultiSelectDropdownField } from './MultiSelectDropdownField'
import { SelectField } from './SelectField'
import { TextField } from './TextField'

export const ACAO_FORM_ID = 'acao-form'

interface AcaoStepFormProps {
  defaultValues?: Partial<AcaoFormInput>
  onValid: (values: AcaoFormValues) => void
}

const t = copy.acao

/** Etapa 4 — Ação com espaçamento padronizado de 16px (space-y-4 / gap-4). */
export function AcaoStepForm({ defaultValues, onValid }: AcaoStepFormProps) {
  const { control, handleSubmit, setValue } = useForm<AcaoFormInput, unknown, AcaoFormValues>({
    resolver: zodResolver(acaoSchema),
    mode: 'onTouched',
    defaultValues: {
      acaoMatriz: '',
      acaoDerivada: '',
      sugestao: '',
      modalidades: [],
      finalidades: [],
      dataInicial: '',
      dataFinal: '',
      dataIncompleta: '',
      ...defaultValues,
    },
  })

  const selectedAcaoMatriz = useWatch({ control, name: 'acaoMatriz' })
  const acaoMatrizObj = options.acoesMatriz.find((a) => a.value === selectedAcaoMatriz)
  const derivadasOptions = acaoMatrizObj?.derivadas ?? []

  return (
    <form id={ACAO_FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className="space-y-4">
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      {/* Ação Matriz e Ação Derivada (16px de diferença: gap-4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          control={control}
          name="acaoMatriz"
          copy={t.acaoMatriz}
          options={options.acoesMatriz}
          placeholder="Selecione a ação matriz"
          onChangeValue={() => {
            setValue('acaoDerivada', '')
          }}
        />

        <SelectField
          control={control}
          name="acaoDerivada"
          copy={t.acaoDerivada}
          options={derivadasOptions}
          placeholder="Selecione a ação derivada"
          disabled={!selectedAcaoMatriz || derivadasOptions.length === 0}
        />
      </div>

      {/* Sugestão (16px) */}
      <TextField
        control={control}
        name="sugestao"
        copy={t.sugestao}
      />

      {/* Modalidade da ação (16px) */}
      <MultiSelectDropdownField
        control={control}
        name="modalidades"
        copy={t.modalidade}
        options={options.modalidades}
        placeholder="Escolha uma opção"
      />

      {/* Finalidade da ação (16px) */}
      <MultiSelectDropdownField
        control={control}
        name="finalidades"
        copy={t.finalidade}
        options={options.finalidades}
        placeholder="Selecione as finalidades"
      />

      {/* Datas da ação (16px) */}
      <div>
        <FieldLabel>{t.dataAcao.label}</FieldLabel>
        <div className="mt-1.5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField
            control={control}
            name="dataInicial"
            label="Data inicial"
            placeholder="dd/mm/aaaa"
          />
          <DatePickerField
            control={control}
            name="dataFinal"
            label="Data final"
            placeholder="dd/mm/aaaa"
          />
        </div>
      </div>

      {/* Data incompleta (16px) */}
      <TextField
        control={control}
        name="dataIncompleta"
        copy={t.dataIncompleta}
        className="w-full md:w-[320px]"
        placeholder="Ex.: NI/04/21"
      />
    </form>
  )
}
