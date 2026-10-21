import { z } from 'zod'
import { options } from '../data/agrarioData'

const requiredText = (message: string) => z.string().trim().min(1, message)

export const loginSchema = z.object({
  nome: requiredText('Informe o nome'),
  sobrenome: requiredText('Informe o sobrenome'),
  email: z.string().trim().min(1, 'Informe o e-mail').email('Informe um e-mail válido'),
  codigoNoticia: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^\d{6}AGR_[A-Z0-9]+$/,
      'Use o formato ddmmaa + AGR_ + letra (ex.: 081220AGR_D)',
    ),
})

export const noticiaSchema = z.object({
  titulo: requiredText('Informe o título da notícia'),
  fonte: requiredText('Informe a fonte da notícia'),
  dataNoticia: requiredText('Informe a data da notícia'),
})

export const localSchema = z
  .object({
    macrorregiao: requiredText('Selecione a macrorregião'),
    estado: z.string().optional(),
    municipio: z.string().optional(),
    acaoVirtual: z.enum(['sim', 'nao', 'hibrido'], {
      error: 'Selecione se a ação foi virtual',
    }),
    escalaAcao: z.array(z.string()).min(1, 'Selecione ao menos uma escala'),
  })
  .superRefine((data, ctx) => {
    const regionalComMunicipio = ['norte', 'nordeste', 'sudeste', 'sul', 'centro-oeste']

    if (data.macrorregiao === 'estadual') {
      if (!data.estado || data.estado.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione o estado',
          path: ['estado'],
        })
      }
    } else if (regionalComMunicipio.includes(data.macrorregiao)) {
      if (!data.estado || data.estado.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione o estado',
          path: ['estado'],
        })
      } else {
        const estadoValido = options.estados.some(
          (e) => e.value === data.estado && e.regiao === data.macrorregiao,
        )
        if (!estadoValido) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'O estado selecionado não pertence à macrorregião informada',
            path: ['estado'],
          })
        }
      }
      if (!data.municipio || data.municipio.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe o município e código',
          path: ['municipio'],
        })
      }
    }
  })

export const acaoSchema = z.object({
  acaoMatriz: requiredText('Selecione a Ação Matriz'),
  acaoDerivada: requiredText('Selecione a Ação derivada'),
  finalidade: z.array(z.string()).min(1, 'Selecione ao menos uma finalidade da ação'),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
  dataIncompleta: z.string().optional(),
})

export const pautaSchema = z.object({
  pautaAcao: z.array(z.string()).min(1, 'Selecione ao menos uma pauta da ação'),
  pautaEspecifica: z.string().optional(),
})

export const movimentoSchema = z.object({
  tipos: z.array(z.string()).min(1, 'Selecione o tipo de movimento'),
  outroTipo: z.string().optional(),
  nomes: z.array(z.string()).min(1, 'Selecione o nome do movimento'),
  novoMovimento: z.string().optional(),
  modalidadeMovimento: z
    .array(z.string())
    .min(1, 'Selecione ao menos uma modalidade de movimento'),
  quantidadePessoas: z.coerce
    .number({ message: 'Informe a quantidade de pessoas' })
    .min(0, 'Valor inválido'),
  quantidadeFamilias: z.coerce
    .number({ message: 'Informe a quantidade de famílias' })
    .min(0, 'Valor inválido'),
})

const instituicaoSubSchema = z.object({
  tipos: z.array(z.string()).min(1, 'Selecione o tipo de instituição'),
  novoTipo: z.string().optional(),
  nomes: z.array(z.string()).min(1, 'Selecione o nome da instituição'),
  novoNome: z.string().optional(),
})

export const instituicoesSchema = z.object({
  aliada: instituicaoSubSchema,
  opositora: instituicaoSubSchema,
})

export const odsSchema = z.object({
  objetivos: z.array(z.string()).min(1, 'Selecione ao menos um ODS'),
})

export type AgrarioLoginFormInput = z.input<typeof loginSchema>
export type AgrarioLoginFormValues = z.output<typeof loginSchema>

export type AgrarioNoticiaFormInput = z.input<typeof noticiaSchema>
export type AgrarioNoticiaFormValues = z.output<typeof noticiaSchema>

export type AgrarioLocalFormInput = z.input<typeof localSchema>
export type AgrarioLocalFormValues = z.output<typeof localSchema>

export type AgrarioAcaoFormInput = z.input<typeof acaoSchema>
export type AgrarioAcaoFormValues = z.output<typeof acaoSchema>

export type AgrarioPautaFormInput = z.input<typeof pautaSchema>
export type AgrarioPautaFormValues = z.output<typeof pautaSchema>

export type AgrarioMovimentoFormInput = z.input<typeof movimentoSchema>
export type AgrarioMovimentoFormValues = z.output<typeof movimentoSchema>

export type AgrarioInstituicoesFormInput = z.input<typeof instituicoesSchema>
export type AgrarioInstituicoesFormValues = z.output<typeof instituicoesSchema>

export type AgrarioOdsFormInput = z.input<typeof odsSchema>
export type AgrarioOdsFormValues = z.output<typeof odsSchema>
