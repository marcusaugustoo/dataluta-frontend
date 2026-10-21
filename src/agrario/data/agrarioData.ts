import type {
  AcaoMatriz,
  AgrarioStep,
  AgrarioSubmission,
  CodeSegment,
  Estado,
  FieldCopy,
  Macrorregiao,
  Ods,
  Option,
} from '../types/agrarioTypes'
import { odsData } from '../../data/mockData'
import { slugify } from '../../utils/slugify'

const toOptions = (labels: readonly string[]): Option[] =>
  labels.map((label) => ({ value: slugify(label), label }))

export const brand = {
  title: 'Dataluta Agrário',
  subtitle: 'Formulário para cadastro de notícias',
  requiredLegend: 'Campo obrigatório',
} as const

export const steps: AgrarioStep[] = [
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
      label: 'Código da notícia 2023',
      required: true,
      placeholder: 'Ex.:  081220AGR_D',
    } satisfies FieldCopy,
    codeGuide: {
      title: 'Ordem do código',
      example: 'Ex: 081220AGR_D (Notícia D de 08/12/2020)',
      segments: [
        { value: '08', caption: 'dia' },
        { value: '12', caption: 'mês' },
        { value: '20', caption: 'ano' },
        { value: 'AGR', caption: 'sigla' },
        { value: '_D', caption: 'letra' },
      ] satisfies CodeSegment[],
    },
  },
  noticia: {
    titulo: {
      label: 'Título da notícia',
      required: true,
      placeholder: 'Ex.: Marcha camponesa reúne milhares por reforma agrária',
    } satisfies FieldCopy,
    fonte: {
      label: 'Fonte da notícia',
      required: true,
      placeholder: 'Ex.: Jornal do Brasil / Brasil de Fato',
    } satisfies FieldCopy,
    dataNoticia: {
      label: 'Data da notícia',
      required: true,
      placeholder: '08/12/2020',
      helperText: 'Formato: dia/mês/ano',
    } satisfies FieldCopy,
  },
  local: {
    macrorregiao: { label: 'Macrorregião', required: true } satisfies FieldCopy,
    estado: { label: 'Estado', required: true } satisfies FieldCopy,
    municipio: { label: 'Município & código', required: true } satisfies FieldCopy,
    acaoVirtual: { label: 'Ação virtual?', required: true } satisfies FieldCopy,
    escalaAcao: { label: 'Escala da ação', required: true } satisfies FieldCopy,
  },
  acao: {
    acaoMatriz: { label: 'Ação Matriz', required: true } satisfies FieldCopy,
    acaoDerivada: { label: 'Ação derivada', required: true } satisfies FieldCopy,
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
    pautaAcao: { label: 'Pauta da ação', required: true } satisfies FieldCopy,
    pautaEspecifica: {
      label: 'Pauta específica',
      required: false,
      placeholder: 'Ex.: Reforma Agrária; Regularização Fundiária; N.I.',
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
    modalidadeMovimento: {
      label: 'Modalidade de movimento',
      required: true,
      placeholder: 'Selecione as modalidades',
    } satisfies FieldCopy,
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
      placeholder: 'Selecionar instituições',
    } satisfies FieldCopy,
    novoNome: {
      label: 'Cadastrar novo nome de instituição',
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
      'Produção e distribuição de plano básico ambiental',
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
    ['Cerimônia festiva', 'Ritual cosmopolítico', 'Vigília de cunho religioso'],
  ],
  ['Judicialização', ['Ação civil pública', 'Ofício de reivindicação de ato do executivo']],
  [
    'Ocupação',
    [
      'Acampamento',
      'Ocupação de latifúndio improdutivo',
      'Ocupação de área pública/órgão público (INCRA, MDA)',
      'Ocupação de espaço privado',
      'Ocupação de espaço público',
      'Ocupação de rodovia/bloqueio',
      'Retomada de território/patrimônio',
    ],
  ],
  [
    'Violência/atos violentos',
    [
      'Autodefesa do território',
      'Confronto físico',
      'Confronto verbal',
      'Violência contra o patrimônio privado',
      'Violência contra o patrimônio público',
      'Resistência ao despejo',
    ],
  ],
  ['Não categorizado', []],
]

const acoesMatriz: AcaoMatriz[] = acaoMatrizRaw.map(([label, derivadas]) => ({
  value: slugify(label),
  label,
  derivadas: toOptions(derivadas),
}))

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
  acaoVirtual: [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
    { value: 'hibrido', label: 'Híbrido' },
  ] satisfies Option<AgrarioSubmission['local']['acaoVirtual']>[],
  escalaAcao: toOptions(['Internacional', 'Nacional', 'Regional', 'Estadual', 'Municipal']),
  acoesMatriz,
  finalidades: toOptions([
    'Outra',
    'Denúncia',
    'Informativa',
    'Propositiva',
    'Defensiva',
    'Conquistada',
    'Reivindicativa',
  ]),
  pautasAcao: toOptions([
    'Reforma Agrária e Distribuição de Terras',
    'Regularização Fundiária',
    'Crédito e Fomento à Agricultura Familiar',
    'Assistência Técnica e Extensão Rural (ATER)',
    'Soberania e Segurança Alimentar',
    'Agroecologia e Produção Sustentável',
    'Demarcação e Titulação de Territórios Quilombolas',
    'Infraestrutura Rural (Água, Energia, Estradas)',
    'Educação do Campo',
    'Saúde no Campo',
    'Previdência e Direitos Trabalhistas Rurais',
    'Combate ao Trabalho Escravo',
    'Combate a Agrotóxicos e Contaminação Ambiental',
    'Conflito Fundiário e Violência no Campo',
    'Gênero e Mulheres Camponesas',
    'Juventude Rural',
    'Outros',
  ]),
  tiposMovimento: toOptions([
    'Movimento Camponês',
    'Movimento dos Sem Terra',
    'Movimento dos Pequenos Agricultores',
    'Movimento Sindical de Trabalhadores Rurais',
    'Movimento de Mulheres Camponesas',
    'Movimento de Atingidos por Barragens/Obras',
    'Movimento Quilombola',
    'Movimento Indígena',
    'Movimento Religioso/Pastoral',
    'Movimento Ambientalista',
    'Movimento Estudantil / Juventude do Campo',
    'Movimento Hegemônico / Patronal',
    'Outros',
    'N.I.',
  ]),
  nomesMovimento: toOptions([
    'Movimento dos Trabalhadores Rurais Sem Terra (MST)',
    'Movimento dos Pequenos Agricultores (MPA)',
    'Movimento de Mulheres Camponesas (MMC)',
    'Comissão Pastoral da Terra (CPT)',
    'Confederação Nacional dos Trabalhadores na Agricultura (CONTAG)',
    'Federação dos Trabalhadores na Agricultura Familiar (FETRAF)',
    'Movimento dos Atingidos por Barragens (MAB)',
    'Articulação Nacional de Agroecologia (ANA)',
    'Associação Brasileira de Reforma Agrária (ABRA)',
    'Movimento de Luta pela Terra (MLT)',
    'Frente Nacional de Luta Campo e Cidade (FNL)',
    'Movimento dos Trabalhadores Assalariados Rurais (CONTAR)',
    'Coordenação Nacional de Articulação das Comunidades Negras Rurais Quilombolas (CONAQ)',
    'Articulação dos Povos Indígenas do Brasil (APIB)',
    'União da Agroindústria Canavieira (UNICA)',
    'Sociedade Rural Brasileira (SRB)',
    'Confederação da Agricultura e Pecuária do Brasil (CNA)',
    'Outros',
    'NI',
  ]),
  modalidadeMovimento: toOptions([
    'Ação coletiva socioespacial',
    'Ação coletiva socioterritorial',
  ]),
  tiposInstituicao: toOptions([
    'Empresa / Agroindústria',
    'Estado (Executivo / Ministérios / Autarquias)',
    'Fundação',
    'Igreja / Movimento Religioso / Pastoral',
    'Judiciário / Tribunal',
    'Ministério Público',
    'ONG / Sociedade Civil',
    'Órgão de Segurança Pública (Polícia Militar/Civil/PF)',
    'Partido Político',
    'Poder Legislativo',
    'Sindicato de Trabalhadores',
    'Sindicato Patronal / Federação Agropecuária',
    'Universidade / Instituto de Pesquisa',
    'NI',
    'Outros',
  ]),
  nomesInstituicao: toOptions([
    'Instituto Nacional de Colonização e Reforma Agrária (INCRA)',
    'Ministério do Desenvolvimento Agrário e Agricultura Familiar (MDA)',
    'Ministério da Agricultura e Pecuária (MAPA)',
    'Ministério Público Federal (MPF)',
    'Ministério Público Estadual (MPE)',
    'Defensoria Pública da União (DPU)',
    'Defensoria Pública do Estado (DPE)',
    'Frente Parlamentar da Agropecuária (FPA)',
    'Polícia Militar (PM)',
    'Polícia Federal (PF)',
    'Companhia Nacional de Abastecimento (CONAB)',
    'Empresa Brasileira de Pesquisa Agropecuária (EMBRAPA)',
    'Fundação Nacional dos Povos Indígenas (FUNAI)',
    'Supremo Tribunal Federal (STF)',
    'Prefeituras Municipais',
    'Outros',
    'NI',
  ]),
  ods,
} as const

export const exampleAgrarioSubmission: AgrarioSubmission = {
  login: {
    nome: 'Carlos',
    sobrenome: 'Medeiros',
    email: 'carlos.medeiros@dataluta.org',
    codigoNoticia: '081220AGR_D',
  },
  noticia: {
    titulo: 'Mobilização por crédito fundiário reúne famílias em assentamento',
    fonte: 'Brasil de Fato',
    dataNoticia: '2020-12-08',
  },
  local: {
    macrorregiao: 'nordeste',
    estado: 'PE',
    municipio: 'Petrolina - 2611101',
    acaoVirtual: 'nao',
    escalaAcao: ['regional', 'estadual'],
  },
  acao: {
    acaoMatriz: 'deslocamento-coletivo',
    acaoDerivada: 'marcha',
    finalidade: ['reivindicativa', 'denuncia'],
    dataInicial: '2020-12-08',
    dataIncompleta: '08/12/20',
  },
  pauta: {
    pautaAcao: ['reforma-agraria-e-distribuicao-de-terras', 'credito-e-fomento-a-agricultura-familiar'],
    pautaEspecifica: 'Liberação de crédito emergencial para pequenos produtores',
  },
  movimento: {
    tipos: ['movimento-campones', 'movimento-dos-sem-terra'],
    nomes: ['movimento-dos-trabalhadores-rurais-sem-terra-mst'],
    modalidadeMovimento: ['acao-coletiva-socioterritorial'],
    quantidadePessoas: 450,
    quantidadeFamilias: 120,
  },
  instituicoes: {
    aliada: {
      tipos: ['sindicato-de-trabalhadores', 'igreja-movimento-religioso-pastoral'],
      nomes: ['comissao-pastoral-da-terra-cpt'],
    },
    opositora: {
      tipos: ['empresa-agroindustria'],
      nomes: ['ni'],
    },
  },
  ods: {
    objetivos: ['ods-1', 'ods-2', 'ods-10'],
  },
}
