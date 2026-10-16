import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy } from '../../data/mockData'
import { noticiaSchema, type NoticiaFormInput, type NoticiaFormValues } from '../../schemas/noticiaSchemas'
import { RequiredLegend } from '../ui/Typography'
import { DatePickerField } from './DatePickerField'
import { TextField } from './TextField'

export const NOTICIA_FORM_ID = 'noticia-form'

interface NoticiaStepFormProps {
  defaultValues?: Partial<NoticiaFormInput>
  onValid: (values: NoticiaFormValues) => void
}

const t = copy.noticia

/** Etapa 2 — Notícia com espaçamento estrito de 16px (space-y-4). */
export function NoticiaStepForm({ defaultValues, onValid }: NoticiaStepFormProps) {
  const { control, handleSubmit } = useForm<NoticiaFormInput, unknown, NoticiaFormValues>({
    resolver: zodResolver(noticiaSchema),
    mode: 'onTouched',
    defaultValues: { titulo: '', fonte: '', dataPublicacao: '', ...defaultValues },
  })

  return (
    <form id={NOTICIA_FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className="space-y-4">
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      {/* Título da notícia */}
      <TextField control={control} name="titulo" copy={t.titulo} />

      {/* Fonte da notícia */}
      <TextField control={control} name="fonte" copy={t.fonte} />

      {/* Data da publicação da notícia com calendário interativo para escolha do dia */}
      <DatePickerField
        control={control}
        name="dataPublicacao"
        copy={t.dataPublicacao}
        placeholder="27/02/2000"
        className="w-full md:w-[320px]"
      />
    </form>
  )
}
