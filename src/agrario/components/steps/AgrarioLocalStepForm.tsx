import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { brand, copy, options } from '../../data/agrarioData'
import {
  localSchema,
  type AgrarioLocalFormInput,
  type AgrarioLocalFormValues,
} from '../../schemas/agrarioSchemas'
import { MultiSelectDropdownField } from '../../../components/forms/MultiSelectDropdownField'
import { RadioGroupField } from '../../../components/forms/RadioGroupField'
import { SelectField } from '../../../components/forms/SelectField'
import { TextField } from '../../../components/forms/TextField'
import { RequiredLegend } from '../../../components/ui/Typography'
import { cn } from '../../../utils/cn'

export const AGRARIO_LOCAL_FORM_ID = 'agrario-local-form'

interface AgrarioLocalStepFormProps {
  defaultValues?: Partial<AgrarioLocalFormInput>
  onValid: (values: AgrarioLocalFormValues) => void
}

const t = copy.local

export function AgrarioLocalStepForm({
  defaultValues,
  onValid,
}: AgrarioLocalStepFormProps) {
  const { control, handleSubmit, setValue, getValues } = useForm<
    AgrarioLocalFormInput,
    unknown,
    AgrarioLocalFormValues
  >({
    resolver: zodResolver(localSchema),
    mode: 'onTouched',
    defaultValues: {
      macrorregiao: '',
      estado: '',
      municipio: '',
      acaoVirtual: undefined,
      escalaAcao: [],
      ...defaultValues,
    },
  })

  const selectedMacro = useWatch({ control, name: 'macrorregiao' })

  const showEstado =
    Boolean(selectedMacro) &&
    selectedMacro !== 'internacional' &&
    selectedMacro !== 'nacional'
  const showMunicipio = showEstado && selectedMacro !== 'estadual'

  const filteredEstados = useMemo(() => {
    const regioesGeograficas = ['norte', 'nordeste', 'sudeste', 'sul', 'centro-oeste']
    if (selectedMacro && regioesGeograficas.includes(selectedMacro)) {
      return options.estados.filter((estado) => estado.regiao === selectedMacro)
    }
    return options.estados
  }, [selectedMacro])

  useEffect(() => {
    const currentEstado = getValues('estado')
    const regioesGeograficas = ['norte', 'nordeste', 'sudeste', 'sul', 'centro-oeste']
    if (currentEstado && selectedMacro && regioesGeograficas.includes(selectedMacro)) {
      const estadoObj = options.estados.find((e) => e.value === currentEstado)
      if (estadoObj && estadoObj.regiao !== selectedMacro) {
        setValue('estado', '', { shouldValidate: true })
        setValue('municipio', '', { shouldValidate: true })
      }
    }
  }, [selectedMacro, getValues, setValue])

  return (
    <form
      id={AGRARIO_LOCAL_FORM_ID}
      noValidate
      onSubmit={handleSubmit(onValid)}
      className="space-y-4"
    >
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      <div
        className={cn(
          'grid grid-cols-1 gap-4',
          showMunicipio
            ? 'md:grid-cols-3'
            : showEstado
              ? 'md:grid-cols-2'
              : 'md:grid-cols-3',
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
              setValue('estado', '', { shouldValidate: true })
              setValue('municipio', '', { shouldValidate: true })
            } else if (val === 'estadual') {
              setValue('municipio', '', { shouldValidate: true })
            } else {
              const currentEstado = getValues('estado')
              if (currentEstado) {
                const estadoObj = options.estados.find((e) => e.value === currentEstado)
                if (estadoObj && estadoObj.regiao !== val) {
                  setValue('estado', '', { shouldValidate: true })
                  setValue('municipio', '', { shouldValidate: true })
                }
              }
            }
          }}
        />

        {showEstado && (
          <SelectField
            control={control}
            name="estado"
            copy={t.estado}
            options={filteredEstados}
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

      <RadioGroupField
        control={control}
        name="acaoVirtual"
        copy={t.acaoVirtual}
        options={options.acaoVirtual}
      />

      <MultiSelectDropdownField
        control={control}
        name="escalaAcao"
        copy={t.escalaAcao}
        options={options.escalaAcao}
        placeholder="Selecione as escalas"
      />
    </form>
  )
}
