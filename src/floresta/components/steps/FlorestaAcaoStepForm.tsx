import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { brand, copy, options } from '../../data/florestaData'
import { acaoSchema, type AcaoFormInput, type AcaoFormValues } from '../../schemas/florestaSchemas'
import { FieldLabel, RequiredLegend } from '../../../components/ui/Typography'
import { DatePickerField } from '../../../components/forms/DatePickerField'
import { MultiSelectDropdownField } from '../../../components/forms/MultiSelectDropdownField'
import { SelectField } from '../../../components/forms/SelectField'
import { TextField } from '../../../components/forms/TextField'

export const ACAO_FORM_ID = 'floresta-acao-form'

interface FlorestaAcaoStepFormProps {
  defaultValues?: Partial<AcaoFormInput>
  onValid: (values: AcaoFormValues) => void
}

const t = copy.acao

export function FlorestaAcaoStepForm({ defaultValues, onValid }: FlorestaAcaoStepFormProps) {
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

      <TextField
        control={control}
        name="sugestao"
        copy={t.sugestao}
      />

      <MultiSelectDropdownField
        control={control}
        name="modalidades"
        copy={t.modalidade}
        options={options.modalidades}
        placeholder="Escolha uma opção"
      />

      <MultiSelectDropdownField
        control={control}
        name="finalidades"
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

export const AcaoStepForm = FlorestaAcaoStepForm
