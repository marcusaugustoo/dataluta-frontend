import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import odsGridImg from '../../../assets/images/ods-grid.png'
import { brand, copy, options } from '../../data/florestaData'
import { odsSchema, type OdsFormInput, type OdsFormValues } from '../../schemas/florestaSchemas'
import { RequiredLegend, Text } from '../../../components/ui/Typography'
import { MultiSelectDropdownField } from '../../../components/forms/MultiSelectDropdownField'

export const ODS_FORM_ID = 'floresta-ods-form'

interface FlorestaOdsStepFormProps {
  defaultValues?: Partial<OdsFormInput>
  onValid: (values: OdsFormValues) => void
}

const t = copy.ods

export function FlorestaOdsStepForm({ defaultValues, onValid }: FlorestaOdsStepFormProps) {
  const { control, handleSubmit } = useForm<OdsFormInput, unknown, OdsFormValues>({
    resolver: zodResolver(odsSchema),
    mode: 'onTouched',
    defaultValues: {
      objetivos: [],
      ...defaultValues,
    },
  })

  const [showImage, setShowImage] = useState(false)

  return (
    <form id={ODS_FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className="space-y-4">
      <RequiredLegend>{brand.requiredLegend}</RequiredLegend>

      <MultiSelectDropdownField
        control={control}
        name="objetivos"
        copy={t.objetivos}
        options={options.ods}
        placeholder="Selecione os ODS"
      />

      <div className="space-y-3 pt-2 border-t border-[#F0F0F0]">
        <div className="flex items-center justify-between">
          <Text variant="body" className="font-semibold text-[#222222]">
            {t.consult}
          </Text>

          <button
            type="button"
            onClick={() => setShowImage((prev) => !prev)}
            className="text-[12px] font-semibold text-[#2E7D32] hover:text-[#17301D] hover:underline cursor-pointer"
          >
            {showImage ? 'Ocultar imagem' : 'Ver imagem ilustrativa'}
          </button>
        </div>

        {showImage && (
          <div className="flex justify-center p-3 rounded-xl bg-[#F8FAF8] border border-[#E0E0E0] animate-fadeIn">
            <img
              src={odsGridImg}
              alt="Objetivos de Desenvolvimento Sustentável (ODS da ONU)"
              className="w-full max-w-[680px] rounded-md object-contain select-none"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {options.ods.map((item) => (
            <div
              key={item.value}
              className="flex items-center justify-between px-3 py-2 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span
                  style={{ backgroundColor: item.color }}
                  className="shrink-0 px-2 py-0.5 rounded text-[11px] font-extrabold text-white shadow-xs"
                >
                  ODS {item.number}
                </span>
                <span className="text-[13px] text-[#333333] font-medium truncate">
                  {item.title}
                </span>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 text-[12px] font-bold text-[#2E7D32] hover:text-[#17301D] hover:underline pl-2"
                title={`Abrir página oficial do ODS ${item.number} na ONU Brasil`}
              >
                <span>Link original</span>
                <span className="text-[13px] leading-none">↗</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
}

export const OdsStepForm = FlorestaOdsStepForm
