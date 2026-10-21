import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { brand, copy } from '../../data/florestaData'
import { loginSchema, type LoginFormInput, type LoginFormValues } from '../../schemas/florestaSchemas'
import { RequiredLegend, RequiredMark } from '../../../components/ui/Typography'
import { FlorestaCodeGuide } from '../FlorestaCodeGuide'
import { TextField } from '../../../components/forms/TextField'

export const LOGIN_FORM_ID = 'floresta-login-form'

interface FlorestaLoginStepFormProps {
  defaultValues?: Partial<LoginFormInput>
  onValid: (values: LoginFormValues) => void
}

const t = copy.login

export function FlorestaLoginStepForm({ defaultValues, onValid }: FlorestaLoginStepFormProps) {
  const { control, handleSubmit } = useForm<LoginFormInput, unknown, LoginFormValues>({
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
    <form id={LOGIN_FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className="space-y-4">
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
          />
          <TextField
            control={control}
            name="sobrenome"
            label={t.sobrenome.label}
            labelClassName="text-[14px] text-[#555555] font-normal"
            autoComplete="family-name"
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
          className="w-full md:w-[320px]"
          maxLength={12}
        />

        <div className="mt-2.5">
          <FlorestaCodeGuide
            title={t.codeGuide.title}
            segments={t.codeGuide.segments}
            example={t.codeGuide.example}
          />
        </div>
      </div>
    </form>
  )
}

export const LoginStepForm = FlorestaLoginStepForm
