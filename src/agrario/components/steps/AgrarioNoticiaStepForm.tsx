import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy } from '../../data/agrarioData'
import {
  noticiaSchema,
  type AgrarioNoticiaFormInput,
  type AgrarioNoticiaFormValues,
} from '../../schemas/agrarioSchemas'
import { DatePickerField } from '../../../components/forms/DatePickerField'
import { TextField } from '../../../components/forms/TextField'
import { RequiredLegend } from '../../../components/ui/Typography'

export const AGRARIO_NOTICIA_FORM_ID = 'agrario-noticia-form'

interface AgrarioNoticiaStepFormProps {
  defaultValues?: Partial<AgrarioNoticiaFormInput>
  onValid: (values: AgrarioNoticiaFormValues) => void
}

const t = copy.noticia


export function AgrarioNoticiaStepForm({
  defaultValues,
  onValid,
}: AgrarioNoticiaStepFormProps) {
  const { control, handleSubmit } = useForm<
    AgrarioNoticiaFormInput,
    unknown,
    AgrarioNoticiaFormValues
  >({
    resolver: zodResolver(noticiaSchema),
    mode: 'onTouched',
    defaultValues: {
      titulo: '',
      fonte: '',
      dataNoticia: '',
      ...defaultValues,
    },
  })

  return (
    <form
      id={AGRARIO_NOTICIA_FORM_ID}
      noValidate
      onSubmit={handleSubmit(onValid)}
      className="space-y-4"
    >
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      <TextField control={control} name="titulo" copy={t.titulo} />

      <TextField control={control} name="fonte" copy={t.fonte} />

      <DatePickerField
        control={control}
        name="dataNoticia"
        copy={t.dataNoticia}
        placeholder="08/12/2020"
        className="w-full md:w-[320px]"
      />
    </form>
  )
}
