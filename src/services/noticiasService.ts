import type { AgrarioSubmission } from '../agrario/types/agrarioTypes'
import type { FlorestaSubmission } from '../floresta/types/florestaTypes'
import { supabase } from '../lib/supabase'

export type ModuloNoticia = 'floresta' | 'agrario'

export interface EnviarNoticiaResult {
  id: number
  codigo_noticia: string
}

export interface HistoricoNoticiaItem {
  id: number
  codigo_noticia: string
  modulo: ModuloNoticia
  status: string
  titulo: string
  fonte: string
  data_publicacao: string
  municipio?: string | null
  estado?: string | null
  criado_em: string
  usuario_nome: string
  usuario_email: string
}

const LOCAL_CACHE_KEY = 'dataluta_historico_submissoes_v1'

function lerCacheLocal(): HistoricoNoticiaItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as HistoricoNoticiaItem[]) : []
  } catch {
    return []
  }
}

function salvarNoCacheLocal(item: HistoricoNoticiaItem): void {
  try {
    const atual = lerCacheLocal().filter(
      (x) => x.codigo_noticia.toUpperCase() !== item.codigo_noticia.toUpperCase(),
    )
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify([item, ...atual]))
  } catch {
    // Ignora falha de quota/acesso ao localStorage
  }
}

/**
 * Envia o cadastro completo de uma notícia (junto com os dados do cadastrador da etapa 1)
 * para a função RPC `public.enviar_noticia` no Supabase.
 */
export async function enviarNoticia(
  modulo: 'floresta',
  dados: FlorestaSubmission,
): Promise<EnviarNoticiaResult>
export async function enviarNoticia(
  modulo: 'agrario',
  dados: AgrarioSubmission,
): Promise<EnviarNoticiaResult>
export async function enviarNoticia(
  modulo: ModuloNoticia,
  dados: FlorestaSubmission | AgrarioSubmission,
): Promise<EnviarNoticiaResult> {
  const { data, error } = await supabase.rpc('enviar_noticia', {
    p_modulo: modulo,
    p_dados: dados,
  })

  if (error) {
    throw new Error(error.message || 'Não foi possível salvar a notícia no banco de dados.')
  }

  const result = data as EnviarNoticiaResult
  const dataPublicacao =
    'dataPublicacao' in dados.noticia ? dados.noticia.dataPublicacao : dados.noticia.dataNoticia

  salvarNoCacheLocal({
    id: result.id,
    codigo_noticia: result.codigo_noticia,
    modulo,
    status: 'enviada',
    titulo: dados.noticia.titulo.trim(),
    fonte: dados.noticia.fonte.trim(),
    data_publicacao: dataPublicacao,
    municipio: dados.local.municipio ?? null,
    estado: dados.local.estado ?? null,
    criado_em: new Date().toISOString(),
    usuario_nome: `${dados.login.nome.trim()} ${dados.login.sobrenome.trim()}`.trim(),
    usuario_email: dados.login.email.trim().toLowerCase(),
  })

  return result
}

/**
 * Busca o histórico de submissões no Supabase (via RPC `listar_historico_noticias`)
 * e mescla com o cache local do navegador caso a RPC ainda não tenha sido criada no banco.
 */
export async function listarHistoricoNoticias(
  emailFiltro?: string,
): Promise<HistoricoNoticiaItem[]> {
  const filtro = emailFiltro?.trim().toLowerCase() ?? ''

  const { data, error } = await supabase.rpc('listar_historico_noticias', {
    p_modulo: null,
    p_email: filtro || null,
  })

  const remotos: HistoricoNoticiaItem[] = !error && Array.isArray(data) ? data : []
  const locais = lerCacheLocal().filter((item) =>
    filtro ? item.usuario_email.toLowerCase().includes(filtro) : true,
  )

  const mapa = new Map<string, HistoricoNoticiaItem>()
  for (const item of remotos) {
    mapa.set(item.codigo_noticia.toUpperCase(), item)
  }
  for (const item of locais) {
    const chave = item.codigo_noticia.toUpperCase()
    if (!mapa.has(chave)) {
      mapa.set(chave, item)
    }
  }

  return [...mapa.values()].sort(
    (a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime(),
  )
}
