/** Tipos de domínio do formulário Dataluta Floresta. */

export type StepId =
  | 'login'
  | 'noticia'
  | 'local'
  | 'acao'
  | 'pauta'
  | 'movimento'
  | 'instituicoes'
  | 'ods'

export interface Step {
  id: StepId
  order: number
  label: string
}

export interface Option<TValue extends string = string> {
  value: TValue
  label: string
}

/** Metadados textuais de um campo (label, placeholder, helper, obrigatoriedade). */
export interface FieldCopy {
  label: string
  required: boolean
  placeholder?: string
  helperText?: string
}

export interface CodeSegment {
  value: string
  caption: string
}

export interface Macrorregiao extends Option {
  /** Se false, os campos Estado / Município & código ficam ocultos. */
  enablesLocationFields: boolean
}

export interface Estado extends Option {
  /** Código IBGE da UF */
  ibgeCode: number
  regiao: 'norte' | 'nordeste' | 'sudeste' | 'sul' | 'centro-oeste'
}

export interface AcaoMatriz extends Option {
  derivadas: Option[]
}

export interface Ods extends Option {
  number: number
  title: string
  finalidade: string
  url: string
  color: string
}

/** Formato da submissão completa (todas as etapas). */
export interface NoticiaSubmission {
  login: {
    nome: string
    sobrenome: string
    email: string
    codigoNoticia: string
  }
  noticia: {
    titulo: string
    fonte: string
    dataPublicacao: string // ISO yyyy-mm-dd
  }
  local: {
    macrorregiao: string
    estado?: string
    municipio?: string
    localidade: string
    acaoOnline: 'sim' | 'nao' | 'hibrido'
    escalaAcao: string[]
    biomas: string[]
  }
  acao: {
    acaoMatriz: string
    acaoDerivada: string
    sugestao?: string
    modalidades: string[]
    finalidades: string[]
    dataInicial?: string
    dataFinal?: string
    dataIncompleta?: string
  }
  pauta: {
    pautasAmplas: string[]
    pautaEspecifica?: string
  }
  movimento: {
    tipos: string[]
    outroTipo?: string
    nomes: string[]
    novoMovimento?: string
    lupemOposicao?: 'sim' | 'nao'
    quantidadePessoas: number
    quantidadeFamilias: number
  }
  instituicoes: {
    aliada: InstituicaoEntry
    opositora: InstituicaoEntry
  }
  ods: {
    objetivos: string[]
  }
}

export interface InstituicaoEntry {
  tipos: string[]
  novoTipo?: string
  nomes: string[]
  novoNome?: string
}
