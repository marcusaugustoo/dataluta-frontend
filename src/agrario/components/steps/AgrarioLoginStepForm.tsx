import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy } from '../../data/agrarioData'
import {
  loginSchema,
  type AgrarioLoginFormInput,
  type AgrarioLoginFormValues,
} from '../../schemas/agrarioSchemas'
import { TextField } from '../../../components/forms/TextField'
import { RequiredLegend, RequiredMark } from '../../../components/ui/Typography'
import { AgrarioCodeGuide } from '../AgrarioCodeGuide'

export const AGRARIO_LOGIN_FORM_ID = 'agrario-login-form'

interface AgrarioLoginStepFormProps {
  defaultValues?: Partial<AgrarioLoginFormInput>
  onValid: (values: AgrarioLoginFormValues) => void
}

const t = copy.login


export function AgrarioLoginStepForm({ defaultValues, onValid }: AgrarioLoginStepFormProps) {
  const { control, handleSubmit } = useForm<
    AgrarioLoginFormInput,
    unknown,
    AgrarioLoginFormValues
  >({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      nome: '',
      sobrenome: '',
      email: '',
      codigoNoticia: '',
      ...defaultValues,
    },
  })

  return (
    <form
      id={AGRARIO_LOGIN_FORM_ID}
      noValidate
      onSubmit={handleSubmit(onValid)}
      className="space-y-4"
    >
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      <div>
        <div className="text-[16px] font-medium text-[#222222]">
          {t.responsavel.label}
          {t.responsavel.required && <RequiredMark />}
        </div>
        <div className="mt-1.5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            control={control}
            name="nome"
            label={t.nome.label}
            labelClassName="text-[14px] text-[#555555] font-normal"
            autoComplete="given-name"
            placeholder="Ex.: Maria"
          />
          <TextField
            control={control}
            name="sobrenome"
            label={t.sobrenome.label}
            labelClassName="text-[14px] text-[#555555] font-normal"
            autoComplete="family-name"
            placeholder="Ex.: da Silva"
          />
        </div>
      </div>

      <div>
        <TextField
          control={control}
          name="email"
          copy={t.email}
          type="email"
          autoComplete="email"
        />
      </div>

      <div>
        <TextField
          control={control}
          name="codigoNoticia"
          copy={t.codigoNoticia}
          className="w-full md:w-[340px]"
          maxLength={15}
        />

        <div className="mt-2.5">
          <AgrarioCodeGuide
            title={t.codeGuide.title}
            segments={t.codeGuide.segments}
            example={t.codeGuide.example}
          />
        </div>
      </div>
    </form>
  )
}
