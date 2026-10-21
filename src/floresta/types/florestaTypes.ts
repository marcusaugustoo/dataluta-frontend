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
  enablesLocationFields: boolean
}

export interface Estado extends Option {
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
    dataPublicacao: string
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

export type FlorestaSubmission = NoticiaSubmission
