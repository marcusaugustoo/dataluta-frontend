import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy, options } from '../../data/mockData'
import {
  instituicoesSchema,
  type InstituicoesFormInput,
  type InstituicoesFormValues,
} from '../../schemas/noticiaSchemas'
import { cn } from '../../utils/cn'
import { RequiredLegend, Text } from '../ui/Typography'
import { MultiSelectDropdownField } from './MultiSelectDropdownField'
import { TextField } from './TextField'

export const INSTITUICOES_FORM_ID = 'instituicoes-form'

interface InstituicoesStepFormProps {
  defaultValues?: Partial<InstituicoesFormInput>
  onValid: (values: InstituicoesFormValues) => void
}

const t = copy.instituicoes

/** Etapa 7 — Instituições com espaçamento padronizado de 16px (space-y-4). */
export function InstituicoesStepForm({ defaultValues, onValid }: InstituicoesStepFormProps) {
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

      {/* Tabs Aliada / Opositora */}
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

        {/* Tipo de Instituição */}
        <MultiSelectDropdownField
          control={control}
          name={`${activeTab}.tipos`}
          copy={t.tipo}
          options={options.tiposInstituicao}
          placeholder="Selecione os tipos de instituição"
        />

        {/* Cadastrar novo tipo de instituição (16px) */}
        <TextField
          control={control}
          name={`${activeTab}.novoTipo`}
          copy={t.novoTipo}
        />

        {/* Nome da instituição (16px) */}
        <MultiSelectDropdownField
          control={control}
          name={`${activeTab}.nomes`}
          copy={t.nome}
          options={options.nomesInstituicao}
          placeholder="Selecionar movimentos"
        />

        {/* Cadastrar novo nome de instituições (16px) */}
        <TextField
          control={control}
          name={`${activeTab}.novoNome`}
          copy={t.novoNome}
        />
      </div>
    </form>
  )
}
