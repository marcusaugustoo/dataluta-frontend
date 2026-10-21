import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { brand, copy, options } from '../../data/agrarioData'
import {
  acaoSchema,
  type AgrarioAcaoFormInput,
  type AgrarioAcaoFormValues,
} from '../../schemas/agrarioSchemas'
import { DatePickerField } from '../../../components/forms/DatePickerField'
import { MultiSelectDropdownField } from '../../../components/forms/MultiSelectDropdownField'
import { SelectField } from '../../../components/forms/SelectField'
import { TextField } from '../../../components/forms/TextField'
import { FieldLabel, RequiredLegend } from '../../../components/ui/Typography'

export const AGRARIO_ACAO_FORM_ID = 'agrario-acao-form'

interface AgrarioAcaoStepFormProps {
  defaultValues?: Partial<AgrarioAcaoFormInput>
  onValid: (values: AgrarioAcaoFormValues) => void
}

const t = copy.acao

export function AgrarioAcaoStepForm({ defaultValues, onValid }: AgrarioAcaoStepFormProps) {
  const { control, handleSubmit, setValue } = useForm<
    AgrarioAcaoFormInput,
    unknown,
    AgrarioAcaoFormValues
  >({
    resolver: zodResolver(acaoSchema),
    mode: 'onTouched',
    defaultValues: {
      acaoMatriz: '',
      acaoDerivada: '',
      finalidade: [],
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
    <form
      id={AGRARIO_ACAO_FORM_ID}
      noValidate
      onSubmit={handleSubmit(onValid)}
      className="space-y-4"
    >
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>
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

      <MultiSelectDropdownField
        control={control}
        name="finalidade"
        copy={t.finalidade}
        options={options.finalidades}
        placeholder="Selecione as finalidades"
      />

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
