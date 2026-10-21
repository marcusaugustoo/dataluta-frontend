import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy } from '../../data/florestaData'
import { noticiaSchema, type NoticiaFormInput, type NoticiaFormValues } from '../../schemas/florestaSchemas'
import { RequiredLegend } from '../../../components/ui/Typography'
import { DatePickerField } from '../../../components/forms/DatePickerField'
import { TextField } from '../../../components/forms/TextField'

export const NOTICIA_FORM_ID = 'floresta-noticia-form'

interface FlorestaNoticiaStepFormProps {
  defaultValues?: Partial<NoticiaFormInput>
  onValid: (values: NoticiaFormValues) => void
}

const t = copy.noticia

export function FlorestaNoticiaStepForm({ defaultValues, onValid }: FlorestaNoticiaStepFormProps) {
  const { control, handleSubmit } = useForm<NoticiaFormInput, unknown, NoticiaFormValues>({
    resolver: zodResolver(noticiaSchema),
    mode: 'onTouched',
    defaultValues: { titulo: '', fonte: '', dataPublicacao: '', ...defaultValues },
  })

  return (
    <form id={NOTICIA_FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className="space-y-4">
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      <TextField control={control} name="titulo" copy={t.titulo} />

      <TextField control={control} name="fonte" copy={t.fonte} />

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

export const NoticiaStepForm = FlorestaNoticiaStepForm
