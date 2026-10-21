import { z } from 'zod'
import { options } from '../data/florestaData'

const requiredText = (message: string) => z.string().trim().min(1, message)

export const loginSchema = z.object({
  nome: requiredText('Informe o nome'),
  sobrenome: requiredText('Informe o sobrenome'),
  email: z.string().trim().min(1, 'Informe o e-mail').email('Informe um e-mail válido'),
  codigoNoticia: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^FLO\d{6}[A-Z]$/, 'Use o formato FLO + ddmmaa + letra (ex.: FLO200124A)'),
})

export const noticiaSchema = z.object({
  titulo: requiredText('Informe o título da notícia'),
  fonte: requiredText('Informe a fonte da notícia'),
  dataPublicacao: requiredText('Informe a data da publicação'),
})

export const localSchema = z
  .object({
    macrorregiao: requiredText('Selecione a macrorregião'),
    estado: z.string().optional(),
    municipio: z.string().optional(),
    localidade: requiredText('Informe a localidade'),
    acaoOnline: z.enum(['sim', 'nao', 'hibrido'], {
      error: 'Selecione se a ação foi on-line',
    }),
    escalaAcao: z.array(z.string()).min(1, 'Selecione ao menos uma escala'),
    biomas: z.array(z.string()).min(1, 'Selecione ao menos um bioma'),
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
  sugestao: z.string().optional(),
  modalidades: z.array(z.string()).optional().default([]),
  finalidades: z.array(z.string()).min(1, 'Selecione ao menos uma finalidade'),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
  dataIncompleta: z.string().optional(),
})

export const pautaSchema = z.object({
  pautasAmplas: z.array(z.string()).min(1, 'Selecione as pautas amplas'),
  pautaEspecifica: z.string().optional(),
})

export const movimentoSchema = z.object({
  tipos: z.array(z.string()).min(1, 'Selecione o tipo de movimento'),
  outroTipo: z.string().optional(),
  nomes: z.array(z.string()).min(1, 'Selecione o nome do movimento'),
  novoMovimento: z.string().optional(),
  lupemOposicao: z.enum(['sim', 'nao']).optional(),
  quantidadePessoas: z.coerce.number({ message: 'Informe a quantidade de pessoas' }).min(0, 'Valor inválido'),
  quantidadeFamilias: z.coerce.number({ message: 'Informe a quantidade de famílias' }).min(0, 'Valor inválido'),
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

export type LoginFormInput = z.input<typeof loginSchema>
export type LoginFormValues = z.output<typeof loginSchema>

export type NoticiaFormInput = z.input<typeof noticiaSchema>
export type NoticiaFormValues = z.output<typeof noticiaSchema>

export type LocalFormInput = z.input<typeof localSchema>
export type LocalFormValues = z.output<typeof localSchema>

export type AcaoFormInput = z.input<typeof acaoSchema>
export type AcaoFormValues = z.output<typeof acaoSchema>

export type PautaFormInput = z.input<typeof pautaSchema>
export type PautaFormValues = z.output<typeof pautaSchema>

export type MovimentoFormInput = z.input<typeof movimentoSchema>
export type MovimentoFormValues = z.output<typeof movimentoSchema>

export type InstituicoesFormInput = z.input<typeof instituicoesSchema>
export type InstituicoesFormValues = z.output<typeof instituicoesSchema>

export type OdsFormInput = z.input<typeof odsSchema>
export type OdsFormValues = z.output<typeof odsSchema>
