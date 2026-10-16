import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { brand, copy, options } from '../../data/mockData'
import { localSchema, type LocalFormInput, type LocalFormValues } from '../../schemas/noticiaSchemas'
import { cn } from '../../utils/cn'
import { RequiredLegend } from '../ui/Typography'
import { MultiSelectDropdownField } from './MultiSelectDropdownField'
import { RadioGroupField } from './RadioGroupField'
import { SelectField } from './SelectField'
import { TextField } from './TextField'

export const LOCAL_FORM_ID = 'local-form'

interface LocalStepFormProps {
  defaultValues?: Partial<LocalFormInput>
  onValid: (values: LocalFormValues) => void
}

const t = copy.local

/** Etapa 3 — Local com espaçamento padronizado de 16px (space-y-4 / gap-4). */
export function LocalStepForm({ defaultValues, onValid }: LocalStepFormProps) {
  const { control, handleSubmit, setValue } = useForm<LocalFormInput, unknown, LocalFormValues>({
    resolver: zodResolver(localSchema),
    mode: 'onTouched',
    defaultValues: {
      macrorregiao: '',
      estado: '',
      municipio: '',
      localidade: '',
      acaoOnline: undefined,
      escalaAcao: [],
      biomas: [],
      ...defaultValues,
    },
  })

  const selectedMacro = useWatch({ control, name: 'macrorregiao' })

  // Regras de exibição dos campos de localização:
  // - 'internacional' ou 'nacional': não precisa de estado nem de município
  // - 'estadual': precisa apenas de estado (NÃO precisa de município & código)
  // - regiões geográficas ('norte', 'nordeste', 'sudeste', 'sul', 'centro-oeste'): precisa de estado e município
  const showEstado = Boolean(selectedMacro) && selectedMacro !== 'internacional' && selectedMacro !== 'nacional'
  const showMunicipio = showEstado && selectedMacro !== 'estadual'

  return (
    <form id={LOCAL_FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className="space-y-4">
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      {/* Linha com Macrorregião, Estado e Município (16px de diferença: gap-4) */}
      <div
        className={cn(
          'grid grid-cols-1 gap-4',
          showMunicipio ? 'md:grid-cols-3' : showEstado ? 'md:grid-cols-2' : 'md:grid-cols-3',
        )}
      >
        <SelectField
          control={control}
          name="macrorregiao"
          copy={t.macrorregiao}
          options={options.macrorregioes}
          placeholder="Selecione a macrorregião"
          onChangeValue={(val) => {
            if (val === 'internacional' || val === 'nacional') {
              setValue('estado', '')
              setValue('municipio', '')
            } else if (val === 'estadual') {
              setValue('municipio', '')
            }
          }}
        />

        {showEstado && (
          <SelectField
            control={control}
            name="estado"
            copy={t.estado}
            options={options.estados}
            placeholder="Selecione o estado"
          />
        )}

        {showMunicipio && (
          <TextField
            control={control}
            name="municipio"
            copy={t.municipio}
            placeholder="Município & código"
          />
        )}
      </div>

      {/* Localidade (16px) */}
      <TextField
        control={control}
        name="localidade"
        copy={t.localidade}
      />

      {/* Ação on-line? (16px) */}
      <RadioGroupField
        control={control}
        name="acaoOnline"
        copy={t.acaoOnline}
        options={options.acaoOnline}
      />

      {/* Escala da ação (16px) */}
      <MultiSelectDropdownField
        control={control}
        name="escalaAcao"
        copy={t.escalaAcao}
        options={options.escalaAcao}
        placeholder="Selecione as escalas"
      />

      {/* Bioma reivindicado (16px) */}
      <MultiSelectDropdownField
        control={control}
        name="biomas"
        copy={t.bioma}
        options={options.biomas}
        placeholder="Selecione os biomas"
      />
    </form>
  )
}
