import type {
  AcaoMatriz,
  CodeSegment,
  Estado,
  FieldCopy,
  Macrorregiao,
  NoticiaSubmission,
  Ods,
  Option,
  Step,
} from '../types/florestaTypes'
import { slugify } from '../../utils/slugify'

const toOptions = (labels: readonly string[]): Option[] =>
  labels.map((label) => ({ value: slugify(label), label }))

export const brand = {
  title: 'Dataluta Floresta',
  subtitle: 'Formulário para cadastro de notícias',
  requiredLegend: 'Campo obrigatório',
} as const

export const steps: Step[] = [
  { id: 'login', order: 1, label: 'Login' },
  { id: 'noticia', order: 2, label: 'Notícia' },
  { id: 'local', order: 3, label: 'Local' },
  { id: 'acao', order: 4, label: 'Ação' },
  { id: 'pauta', order: 5, label: 'Pauta' },
  { id: 'movimento', order: 6, label: 'Movimento' },
  { id: 'instituicoes', order: 7, label: 'Instituições' },
  { id: 'ods', order: 8, label: 'ODS' },
]

export const actions = {
  back: 'Voltar',
  next: 'Próximo',
  submit: 'ENVIAR',
} as const

export const copy = {
  login: {
    responsavel: { label: 'Nome do responsável', required: true } satisfies FieldCopy,
    nome: { label: 'Nome', required: false } satisfies FieldCopy,
    sobrenome: { label: 'Sobrenome', required: false } satisfies FieldCopy,
    email: {
      label: 'E-mail',
      required: true,
      placeholder: 'Ex.:  meu_email@gmail.com',
    } satisfies FieldCopy,
    codigoNoticia: {
      label: 'Código da notícia',
      required: true,
      placeholder: 'Ex.:  FLO27022000A',
    } satisfies FieldCopy,
    codeGuide: {
      title: 'Ordem do código',
      example: 'Ex: FLO200124A (Notícia A de 20/01/2024)',
      segments: [
        { value: 'FLO', caption: 'sigla' },
        { value: '20', caption: 'dia' },
        { value: '01', caption: 'mês' },
        { value: '24', caption: 'ano' },
        { value: 'A', caption: 'letra' },
      ] satisfies CodeSegment[],
    },
  },
  noticia: {
    titulo: {
      label: 'Título da notícia',
      required: true,
      placeholder: 'Ex.: Panelaço em São Paulo',
    } satisfies FieldCopy,
    fonte: {
      label: 'Fonte da notícia',
      required: true,
      placeholder: 'Ex.: Jornal do Brasil',
    } satisfies FieldCopy,
    dataPublicacao: {
      label: 'Data da publicação da notícia',
      required: true,
      placeholder: '27/02/2000',
      helperText: 'Formato: dia/mês/ano',
    } satisfies FieldCopy,
  },
  local: {
    macrorregiao: { label: 'Macrorregião', required: true } satisfies FieldCopy,
    estado: { label: 'Estado', required: true } satisfies FieldCopy,
    municipio: { label: 'Município & código', required: true } satisfies FieldCopy,
    localidade: {
      label: 'Localidade',
      required: true,
      placeholder: 'Ex.: Ex: Terras Indígenas; Resex; Comunidades; N.I. etc',
    } satisfies FieldCopy,
    acaoOnline: { label: 'Ação on-line?', required: true } satisfies FieldCopy,
    escalaAcao: { label: 'Escala da ação', required: true } satisfies FieldCopy,
    bioma: { label: 'Bioma reivindicado', required: true } satisfies FieldCopy,
  },
  acao: {
    acaoMatriz: { label: 'Ação Matriz', required: true } satisfies FieldCopy,
    acaoDerivada: { label: 'Ação derivada', required: true } satisfies FieldCopy,
    sugestao: {
      label: 'Sugestão de nova Ação Matriz e/ou Ação Derivada',
      required: false,
      placeholder: 'Ex.: Ex: Terras Indígenas; Resex; Comunidades; N.I. etc',
    } satisfies FieldCopy,
    modalidade: {
      label: 'Modalidade da ação',
      required: false,
      placeholder: 'Escolha uma opção',
    } satisfies FieldCopy,
    finalidade: { label: 'Finalidade da ação', required: true } satisfies FieldCopy,
    dataAcao: { label: 'Data da ação', required: false } satisfies FieldCopy,
    dataInicial: { label: 'Data inicial', required: false } satisfies FieldCopy,
    dataFinal: { label: 'Data final', required: false } satisfies FieldCopy,
    dataIncompleta: {
      label: 'Data incompleta',
      required: false,
      helperText: 'Insira a data no formato dd/mm/aa. Exemplo: NI/04/21.',
    } satisfies FieldCopy,
  },
  pauta: {
    pautasAmplas: { label: 'Pautas amplas', required: true } satisfies FieldCopy,
    pautaEspecifica: {
      label: 'Pauta específica',
      required: false,
      placeholder: 'Ex.: Ex: Terras Indígenas; Resex; Comunidades; N.I. etc',
      helperText: 'Insira pautas que não estejam no campo anterior. Se houver mais de uma, separar por ;',
    } satisfies FieldCopy,
  },
  movimento: {
    tipo: { label: 'Tipo de movimento', required: true } satisfies FieldCopy,
    outroTipo: {
      label: 'Outro tipo de movimento',
      required: false,
      helperText: 'Insira outro tipo de movimento desde que não conste na lista anterior',
    } satisfies FieldCopy,
    nome: {
      label: 'Nome do movimento',
      required: true,
      placeholder: 'Selecionar movimentos',
    } satisfies FieldCopy,
    novoMovimento: {
      label: 'Cadastrar novo movimento',
      required: false,
      helperText: 'Insira o nome de outro movimento desde que não conste na lista anterior',
    } satisfies FieldCopy,
    lupem: { label: 'Lupem/Oposição intraclasse', required: false } satisfies FieldCopy,
    quantidadePessoas: {
      label: 'Quantidade de pessoas',
      required: true,
      helperText: 'Quantidade de pessoas no movimento',
    } satisfies FieldCopy,
    quantidadeFamilias: {
      label: 'Quantidade de famílias',
      required: true,
      helperText: 'Quantidade de famílias no movimento',
    } satisfies FieldCopy,
  },
  instituicoes: {
    sections: { aliada: 'INSTITUIÇÃO ALIADA', opositora: 'INSTITUIÇÃO OPOSITORA' },
    tipo: { label: 'Tipo de Instituição', required: true } satisfies FieldCopy,
    novoTipo: {
      label: 'Cadastrar novo tipo de instituição',
      required: false,
      helperText: 'Insira o tipo de outra instituição que não conste na lista anterior',
    } satisfies FieldCopy,
    nome: {
      label: 'Nome da instituição',
      required: true,
      placeholder: 'Selecionar movimentos',
    } satisfies FieldCopy,
    novoNome: {
      label: 'Cadastrar novo nome de instituições',
      required: false,
      helperText: 'Insira o nome de outra instituição desde que não conste na lista anterior',
    } satisfies FieldCopy,
  },
  ods: {
    objetivos: { label: 'ODS', required: true } satisfies FieldCopy,
    consult: 'Consulte as ODS!',
  },
} as const

const macrorregioes: Macrorregiao[] = [
  { value: 'internacional', label: 'Internacional', enablesLocationFields: false },
  { value: 'nacional', label: 'Nacional', enablesLocationFields: false },
  { value: 'estadual', label: 'Estadual', enablesLocationFields: true },
  { value: 'norte', label: 'Norte', enablesLocationFields: true },
  { value: 'nordeste', label: 'Nordeste', enablesLocationFields: true },
  { value: 'sudeste', label: 'Sudeste', enablesLocationFields: true },
  { value: 'sul', label: 'Sul', enablesLocationFields: true },
  { value: 'centro-oeste', label: 'Centro-oeste', enablesLocationFields: true },
]

const estados: Estado[] = [
  { value: 'RO', label: 'Rondônia', ibgeCode: 11, regiao: 'norte' },
  { value: 'AC', label: 'Acre', ibgeCode: 12, regiao: 'norte' },
  { value: 'AM', label: 'Amazonas', ibgeCode: 13, regiao: 'norte' },
  { value: 'RR', label: 'Roraima', ibgeCode: 14, regiao: 'norte' },
  { value: 'PA', label: 'Pará', ibgeCode: 15, regiao: 'norte' },
  { value: 'AP', label: 'Amapá', ibgeCode: 16, regiao: 'norte' },
  { value: 'TO', label: 'Tocantins', ibgeCode: 17, regiao: 'norte' },
  { value: 'MA', label: 'Maranhão', ibgeCode: 21, regiao: 'nordeste' },
  { value: 'PI', label: 'Piauí', ibgeCode: 22, regiao: 'nordeste' },
  { value: 'CE', label: 'Ceará', ibgeCode: 23, regiao: 'nordeste' },
  { value: 'RN', label: 'Rio Grande do Norte', ibgeCode: 24, regiao: 'nordeste' },
  { value: 'PB', label: 'Paraíba', ibgeCode: 25, regiao: 'nordeste' },
  { value: 'PE', label: 'Pernambuco', ibgeCode: 26, regiao: 'nordeste' },
  { value: 'AL', label: 'Alagoas', ibgeCode: 27, regiao: 'nordeste' },
  { value: 'SE', label: 'Sergipe', ibgeCode: 28, regiao: 'nordeste' },
  { value: 'BA', label: 'Bahia', ibgeCode: 29, regiao: 'nordeste' },
  { value: 'MG', label: 'Minas Gerais', ibgeCode: 31, regiao: 'sudeste' },
  { value: 'ES', label: 'Espírito Santo', ibgeCode: 32, regiao: 'sudeste' },
  { value: 'RJ', label: 'Rio de Janeiro', ibgeCode: 33, regiao: 'sudeste' },
  { value: 'SP', label: 'São Paulo', ibgeCode: 35, regiao: 'sudeste' },
  { value: 'PR', label: 'Paraná', ibgeCode: 41, regiao: 'sul' },
  { value: 'SC', label: 'Santa Catarina', ibgeCode: 42, regiao: 'sul' },
  { value: 'RS', label: 'Rio Grande do Sul', ibgeCode: 43, regiao: 'sul' },
  { value: 'MS', label: 'Mato Grosso do Sul', ibgeCode: 50, regiao: 'centro-oeste' },
  { value: 'MT', label: 'Mato Grosso', ibgeCode: 51, regiao: 'centro-oeste' },
  { value: 'GO', label: 'Goiás', ibgeCode: 52, regiao: 'centro-oeste' },
  { value: 'DF', label: 'Distrito Federal', ibgeCode: 53, regiao: 'centro-oeste' },
]

const acaoMatrizRaw: ReadonlyArray<readonly [string, readonly string[]]> = [
  [
    'Ação de interseccionalidade institucional',
    [
      'Criação de protocolo de consulta',
      'Organização de audiência pública',
      'Participação em audiência pública',
    ],
  ],
  [
    'Ação/prática comunicativa',
    [
      'Campanha',
      'Carta cosmopolítica',
      'Carta pública de denúncia',
      'Carta pública de denúncia online',
      'Documento de formação e informação dos movimentos',
      'Entrevista concedida',
      'Envio de delegação diplomática',
      'Live e produção de conteúdo',
      'Nota de pesar',
      'Nota de repúdio',
      'Ofício',
      'Participação em coletiva de imprensa',
      'Tuitaço',
      'Vídeo de denúncia',
    ],
  ],
  [
    'Ações paraestatais',
    [
      'Apreensão de pessoas e/ou maquinário',
      'Autodemarcação',
      'Barreiras sanitárias',
      'Elaboração de relatórios',
      'Levantamento de dados primários',
      'Medida auto organizativa de medicina tradicional',
      'Produção e distribuição de plano básico ambiental-componente indígena (PBA-CI)',
      'Vigilância',
    ],
  ],
  [
    'Arrecadação de recursos ou execução de serviços',
    ['Campanha de solidariedade socioeconômica', 'Doação', 'Mutirão'],
  ],
  ['Deslocamento coletivo', ['Caminhada', 'Carreata', 'Marcha', 'Passeata']],
  [
    'Encontro',
    [
      'Reunião de articulação',
      'Reunião de construção de agenda',
      'Reunião de denúncia',
      'Reunião de negociação',
      'Reunião de orientação sanitária',
      'Reunião de reivindicação de ato administrativo territorial',
      'Reunião de reivindicação de ato do executivo',
      'Reunião de reivindicação de ato do legislativo',
      'Reunião de reivindicação de ato do judiciário',
      'Reunião de reivindicação de correção entre os poderes',
    ],
  ],
  [
    'Evento',
    ['Assembleia', 'Celebração', 'Conferência', 'Feira', 'Fórum', 'Festival', 'Roda de conversa'],
  ],
  [
    'Festividade e ritual',
    ['Cerimônia festiva', 'Ritual cosmopolítico', 'Ritual indígena', 'Vigília de cunho religioso'],
  ],
  ['Judicialização', ['Ação civil pública', 'Ofício de reivindicação de ato do executivo']],
  [
    'Ocupação',
    [
      'Acampamento',
      'Ocupação de área concedida e gestão privatizada',
      'Ocupação de canteiro de obras',
      'Ocupação de espaço privado',
      'Ocupação de espaço público',
      'Ocupação de Floresta Nacional (FLONA)',
      'Retomada de território/patrimônio',
    ],
  ],
  [
    'Violência/atos violentos',
    [
      'Autodefesa do território',
      'Confronto físico',
      'Confronto verbal',
      'Violência contra o patrimônio histórico',
      'Violência contra o patrimônio privado',
      'Violência contra o patrimônio público',
    ],
  ],
  ['Não categorizado', []],
]

const acoesMatriz: AcaoMatriz[] = acaoMatrizRaw.map(([label, derivadas]) => ({
  value: slugify(label),
  label,
  derivadas: toOptions(derivadas),
}))

export interface OdsInfo {
  number: number
  title: string
  finalidade: string
  url: string
  color: string
}

export const odsData: readonly OdsInfo[] = [
  {
    number: 1,
    title: 'Erradicação da Pobreza',
    finalidade: 'Acabar com a pobreza em todas as suas formas, em todos os lugares.',
    url: 'https://brasil.un.org/pt-br/sdgs/1',
    color: '#E5243B',
  },
  {
    number: 2,
    title: 'Fome Zero e Agricultura Sustentável',
    finalidade: 'Acabar com a fome, alcançar a segurança alimentar e melhoria da nutrição e promover a agricultura sustentável.',
    url: 'https://brasil.un.org/pt-br/sdgs/2',
    color: '#DDA63A',
  },
  {
    number: 3,
    title: 'Saúde e Bem-Estar',
    finalidade: 'Assegurar uma vida saudável e promover o bem-estar para todas e todos, em todas as idades.',
    url: 'https://brasil.un.org/pt-br/sdgs/3',
    color: '#4C9F38',
  },
  {
    number: 4,
    title: 'Educação de Qualidade',
    finalidade: 'Assegurar a educação inclusiva e equitativa e de qualidade, e promover oportunidades de aprendizagem ao longo da vida para todas e todos.',
    url: 'https://brasil.un.org/pt-br/sdgs/4',
    color: '#C5192D',
  },
  {
    number: 5,
    title: 'Igualdade de Gênero',
    finalidade: 'Alcançar a igualdade de gênero e empoderar todas as mulheres e meninas.',
    url: 'https://brasil.un.org/pt-br/sdgs/5',
    color: '#FF3A21',
  },
  {
    number: 6,
    title: 'Água Potável e Saneamento',
    finalidade: 'Assegurar a disponibilidade e gestão sustentável da água e saneamento para todas e todos.',
    url: 'https://brasil.un.org/pt-br/sdgs/6',
    color: '#26BDE2',
  },
  {
    number: 7,
    title: 'Energia Limpa e Acessível',
    finalidade: 'Assegurar o acesso confiável, sustentável, moderno e a preço acessível à energia para todas e todos.',
    url: 'https://brasil.un.org/pt-br/sdgs/7',
    color: '#FCC30B',
  },
  {
    number: 8,
    title: 'Trabalho Decente e Crescimento Econômico',
    finalidade: 'Promover o crescimento econômico sustentado, inclusivo e sustentável, emprego pleno e produtivo e trabalho decente para todas e todos.',
    url: 'https://brasil.un.org/pt-br/sdgs/8',
    color: '#A21942',
  },
  {
    number: 9,
    title: 'Indústria, Inovação e Infraestrutura',
    finalidade: 'Construir infraestruturas resilientes, promover a industrialização inclusiva e sustentável e fomentar a inovação.',
    url: 'https://brasil.un.org/pt-br/sdgs/9',
    color: '#FD6925',
  },
  {
    number: 10,
    title: 'Redução das Desigualdades',
    finalidade: 'Reduzir a desigualdade dentro dos países e entre eles.',
    url: 'https://brasil.un.org/pt-br/sdgs/10',
    color: '#DD1367',
  },
  {
    number: 11,
    title: 'Cidades e Comunidades Sustentáveis',
    finalidade: 'Tornar as cidades e os assentamentos humanos inclusivos, seguros, resilientes e sustentáveis.',
    url: 'https://brasil.un.org/pt-br/sdgs/11',
    color: '#FD9D24',
  },
  {
    number: 12,
    title: 'Consumo e Produção Responsáveis',
    finalidade: 'Assegurar padrões de produção e de consumo sustentáveis.',
    url: 'https://brasil.un.org/pt-br/sdgs/12',
    color: '#BF8B2E',
  },
  {
    number: 13,
    title: 'Ação Contra a Mudança Global do Clima',
    finalidade: 'Tomar medidas urgentes para combater a mudança climática e seus impactos.',
    url: 'https://brasil.un.org/pt-br/sdgs/13',
    color: '#3F7E44',
  },
  {
    number: 14,
    title: 'Vida na Água',
    finalidade: 'Conservação e uso sustentável dos oceanos, dos mares e dos recursos marinhos para o desenvolvimento sustentável.',
    url: 'https://brasil.un.org/pt-br/sdgs/14',
    color: '#0A97D9',
  },
  {
    number: 15,
    title: 'Vida Terrestre',
    finalidade: 'Proteger, recuperar e promover o uso sustentável dos ecossistemas terrestres, gerir de forma sustentável as florestas, combater a desertificação, deter e reverter a degradação da terra e deter a perda de biodiversidade.',
    url: 'https://brasil.un.org/pt-br/sdgs/15',
    color: '#56C02B',
  },
  {
    number: 16,
    title: 'Paz, Justiça e Instituições Eficazes',
    finalidade: 'Promover sociedades pacíficas e inclusivas para o desenvolvimento sustentável, proporcionar o acesso à justiça para todos e construir instituições eficazes, responsáveis e inclusivas em todos os níveis.',
    url: 'https://brasil.un.org/pt-br/sdgs/16',
    color: '#00689D',
  },
  {
    number: 17,
    title: 'Parcerias e Meios de Implementação',
    finalidade: 'Fortalecer os meios de implementação e revitalizar a parceria global para o desenvolvimento sustentável.',
    url: 'https://brasil.un.org/pt-br/sdgs/17',
    color: '#19486A',
  },
]

const ods: Ods[] = odsData.map((item) => ({
  number: item.number,
  value: `ods-${item.number}`,
  label: `${item.number}: ${item.title}`,
  title: item.title,
  finalidade: item.finalidade,
  url: item.url,
  color: item.color,
}))

export const options = {
  macrorregioes,
  estados,
  acaoOnline: [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
    { value: 'hibrido', label: 'Híbrido' },
  ] satisfies Option<NoticiaSubmission['local']['acaoOnline']>[],
  escalaAcao: toOptions(['Internacional', 'Nacional', 'Regional', 'Estadual', 'Municipal']),
  biomas: toOptions([
    'Amazônia',
    'Caatinga',
    'Cerrado',
    'Mata Atlântica',
    'Pampa',
    'Pantanal',
    'Todos',
    'NI',
  ]),
  acoesMatriz,
  modalidades: toOptions(['Ação coletiva socioespacial', 'Ação coletiva socioterritorial']),
  finalidades: toOptions([
    'Outra',
    'Denúncia',
    'Informativa',
    'Propositiva',
    'Defensiva',
    'Conquistada',
    'Reivindicativa',
  ]),
  pautasAmplas: toOptions([
    'Alimentação',
    'Articulação e construção de agendas',
    'Atividades econômicas',
    'Autonomia',
    'Cosmovisão, cultura e identidade',
    'Estado e direitos territoriais',
    'Educação',
    'Gênero e Sexualidade',
    'Infraestrutura',
    'Questões socioambientais',
    'Racismo e questões raciais',
    'Saúde',
  ]),
  tiposMovimento: toOptions([
    'N.I.',
    'Outros',
    'Movimento de Atingidos',
    'Movimento Ambientalista',
    'Movimento Camponês',
    'Movimento de Mulheres',
    'Movimento estudantil',
    'Movimento Indígena',
    'Movimento Negro',
    'Movimento Quilombola',
    'Movimento Religioso',
    'Movimento LGBTQIA+',
    'Movimento Hegemônico',
    'Movimento Indigenista',
    'Movimento Indigenista de base eclesiástica',
  ]),
  nomesMovimento: toOptions([
    'NI',
    'Outros',
    'Articulação dos Povos Indígenas do Brasil (APIB)',
    'Coordenação das Organizações Indígenas da Amazônia Brasileira (Coiab)',
    'Articulação dos Povos e Organizações Indígenas do Nordeste, Minas Gerais e Espírito Santo (Apoinme)',
    'Movimento dos Atingidos por Barragens (MAB)',
    'Povo Munduruku',
    'Povo Pataxó',
    'Povo Yanomami',
    'Guardiões da Floresta',
  ]),
  lupemOposicao: [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não (Contrahegemônico)' },
  ] satisfies Option<'sim' | 'nao'>[],
  tiposInstituicao: toOptions([
    'Empresa',
    'Estado',
    'Fundação',
    'Igreja/Movimento Religioso',
    'ONG',
    'Partido',
    'Sindicato',
    'NI',
    'Outros',
  ]),
  nomesInstituicao: toOptions([
    'NI',
    'Outros',
    'Distrito Sanitário Especial Indígena (DSEI)',
    'Fundação Nacional do Índio (FUNAI)',
    'Frente Parlamentar Indígena',
    'Ministério Público Federal (MPF)',
    'PT',
    'PSOL',
    'REDE SUSTENTABILIDADE',
    'Supremo Tribunal Federal (STF)',
  ]),
  ods,
} as const

export const exampleSubmission: NoticiaSubmission = {
  login: {
    nome: 'Maria',
    sobrenome: 'Silva',
    email: 'meu_email@gmail.com',
    codigoNoticia: 'FLO27022000A',
  },
  noticia: {
    titulo: 'Panelaço em São Paulo',
    fonte: 'Jornal do Brasil',
    dataPublicacao: '2000-02-27',
  },
  local: {
    macrorregiao: 'sudeste',
    estado: 'SP',
    municipio: 'São Paulo - 3550308',
    localidade: 'Terras Indígenas',
    acaoOnline: 'nao',
    escalaAcao: ['municipal'],
    biomas: ['mata-atlantica'],
  },
  acao: {
    acaoMatriz: 'deslocamento-coletivo',
    acaoDerivada: 'passeata',
    modalidades: ['acao-coletiva-socioterritorial'],
    finalidades: ['denuncia'],
    dataInicial: '2000-02-27',
    dataIncompleta: 'NI/04/21',
  },
  pauta: {
    pautasAmplas: ['estado-e-direitos-territoriais'],
    pautaEspecifica: 'Terras Indígenas; Resex; Comunidades',
  },
  movimento: {
    tipos: ['movimento-indigena'],
    nomes: ['articulacao-dos-povos-indigenas-do-brasil-apib'],
    lupemOposicao: 'nao',
    quantidadePessoas: 200,
    quantidadeFamilias: 50,
  },
  instituicoes: {
    aliada: { tipos: ['estado'], nomes: ['ministerio-publico-federal-mpf'] },
    opositora: { tipos: ['empresa'], nomes: ['ni'] },
  },
  ods: {
    objetivos: ['ods-10', 'ods-15', 'ods-16'],
  },
}

export const mockData = { brand, steps, actions, copy, options, exampleSubmission } as const
export type MockData = typeof mockData
