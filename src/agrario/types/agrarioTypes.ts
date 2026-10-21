export type AgrarioStepId =
  | 'login'
  | 'noticia'
  | 'local'
  | 'acao'
  | 'pauta'
  | 'movimento'
  | 'instituicoes'
  | 'ods'

export interface AgrarioStep {
  id: AgrarioStepId
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

export interface InstituicaoEntry {
  tipos: string[]
  novoTipo?: string
  nomes: string[]
  novoNome?: string
}

export interface AgrarioSubmission {
  login: {
    nome: string
    sobrenome: string
    email: string
    codigoNoticia: string
  }
  noticia: {
    titulo: string
    fonte: string
    dataNoticia: string
  }
  local: {
    macrorregiao: string
    estado?: string
    municipio?: string
    acaoVirtual: 'sim' | 'nao' | 'hibrido'
    escalaAcao: string[]
  }
  acao: {
    acaoMatriz: string
    acaoDerivada: string
    finalidade: string[]
    dataInicial?: string
    dataFinal?: string
    dataIncompleta?: string
  }
  pauta: {
    pautaAcao: string[]
    pautaEspecifica?: string
  }
  movimento: {
    tipos: string[]
    outroTipo?: string
    nomes: string[]
    novoMovimento?: string
    modalidadeMovimento: string[]
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
