import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy, options } from '../../data/florestaData'
import {
  instituicoesSchema,
  type InstituicoesFormInput,
  type InstituicoesFormValues,
} from '../../schemas/florestaSchemas'
import { cn } from '../../../utils/cn'
import { RequiredLegend, Text } from '../../../components/ui/Typography'
import { MultiSelectDropdownField } from '../../../components/forms/MultiSelectDropdownField'
import { TextField } from '../../../components/forms/TextField'

export const INSTITUICOES_FORM_ID = 'floresta-instituicoes-form'

interface FlorestaInstituicoesStepFormProps {
  defaultValues?: Partial<InstituicoesFormInput>
  onValid: (values: InstituicoesFormValues) => void
}

const t = copy.instituicoes

export function FlorestaInstituicoesStepForm({ defaultValues, onValid }: FlorestaInstituicoesStepFormProps) {
  const [activeTab, setActiveTab] = useState<'aliada' | 'opositora'>('aliada')

  const { control, handleSubmit } = useForm<InstituicoesFormInput, unknown, InstituicoesFormValues>({
    resolver: zodResolver(instituicoesSchema),
    mode: 'onTouched',
    defaultValues: {
      aliada: { tipos: [], novoTipo: '', nomes: [], novoNome: '' },
      opositora: { tipos: [], novoTipo: '', nomes: [], novoNome: '' },
      ...defaultValues,
    },
  })

  return (
    <form id={INSTITUICOES_FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className="space-y-4">
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      <div className="flex gap-4 border-b border-[#E0E0E0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('aliada')}
          className={cn(
            'pb-1 text-[16px] font-bold tracking-wide transition-colors uppercase cursor-pointer',
            activeTab === 'aliada'
              ? 'border-b-2 border-[#2E7D32] text-[#2E7D32]'
              : 'text-[#888888] hover:text-[#333333]',
          )}
        >
          {t.sections.aliada}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('opositora')}
          className={cn(
            'pb-1 text-[16px] font-bold tracking-wide transition-colors uppercase cursor-pointer',
            activeTab === 'opositora'
              ? 'border-b-2 border-[#2E7D32] text-[#2E7D32]'
              : 'text-[#888888] hover:text-[#333333]',
          )}
        >
          {t.sections.opositora}
        </button>
      </div>

      <div className="space-y-4">
        <Text variant="section">
          {activeTab === 'aliada' ? t.sections.aliada : t.sections.opositora}
        </Text>

        <MultiSelectDropdownField
          control={control}
          name={`${activeTab}.tipos`}
          copy={t.tipo}
          options={options.tiposInstituicao}
          placeholder="Selecione os tipos de instituição"
        />

        <TextField
          control={control}
          name={`${activeTab}.novoTipo`}
          copy={t.novoTipo}
        />

        <MultiSelectDropdownField
          control={control}
          name={`${activeTab}.nomes`}
          copy={t.nome}
          options={options.nomesInstituicao}
          placeholder="Selecionar movimentos"
        />

        <TextField
          control={control}
          name={`${activeTab}.novoNome`}
          copy={t.novoNome}
        />
      </div>
    </form>
  )
}

export const InstituicoesStepForm = FlorestaInstituicoesStepForm
