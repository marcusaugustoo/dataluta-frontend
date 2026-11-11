import { useEffect, useMemo, useState } from 'react'
import {
  listarHistoricoNoticias,
  type HistoricoNoticiaItem,
  type ModuloNoticia,
} from '../../services/noticiasService'
import { cn } from '../../utils/cn'

interface SubmissionHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
}

function formatarDataBr(isoDate: string): string {
  if (!isoDate) return ''
  const parts = isoDate.slice(0, 10).split('-')
  if (parts.length !== 3) return isoDate
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

export function SubmissionHistoryDrawer({ isOpen, onClose }: SubmissionHistoryDrawerProps) {
  const [activeTab, setActiveTab] = useState<ModuloNoticia>('floresta')
  const [emailFilter, setEmailFilter] = useState('')
  const [items, setItems] = useState<HistoricoNoticiaItem[] | null>(null)
  const isLoading = isOpen && items === null

  useEffect(() => {
    if (!isOpen) {
      return
    }

    let cancelled = false

    listarHistoricoNoticias().then((res) => {
      if (!cancelled) setItems(res)
    })

    return () => {
      cancelled = true
      setItems(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const normalizedEmail = emailFilter.trim().toLowerCase()

  const filteredByEmail = useMemo(() => {
    const list = items ?? []
    if (!normalizedEmail) return list
    return list.filter((item) => item.usuario_email.toLowerCase().includes(normalizedEmail))
  }, [items, normalizedEmail])

  const florestaItems = useMemo(
    () => filteredByEmail.filter((item) => item.modulo === 'floresta'),
    [filteredByEmail],
  )

  const agrarioItems = useMemo(
    () => filteredByEmail.filter((item) => item.modulo === 'agrario'),
    [filteredByEmail],
  )

  const visibleItems = activeTab === 'floresta' ? florestaItems : agrarioItems
  const isFloresta = activeTab === 'floresta'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel lateral */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Histórico de submissões"
        className="relative z-10 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl border-l border-[#E5E7EB]"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-5">
          <div>
            <h2 className="text-[18px] font-bold text-[#111111]">Histórico de Submissões</h2>
            <p className="mt-0.5 text-[13px] text-[#6B7280]">
              Consulte as notícias enviadas por base e por e-mail
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] hover:bg-gray-100 hover:text-[#111111] transition-colors cursor-pointer"
            aria-label="Fechar histórico"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Filtro por e-mail */}
        <div className="border-b border-[#E5E7EB] bg-[#F9FAFB] px-6 py-4">
          <label
            htmlFor="historico-email-filter"
            className="block text-[12px] font-semibold uppercase tracking-wide text-[#4B5563]"
          >
            Filtrar por e-mail de quem submeteu
          </label>
          <div className="relative mt-1.5">
            <input
              id="historico-email-filter"
              type="email"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              placeholder="Ex.: nome@email.com"
              className="w-full rounded-[10px] border border-[#D1D5DB] bg-white pl-3.5 pr-9 py-2 text-[14px] text-[#111111] placeholder:text-[#9CA3AF] focus:border-[#111111] focus:outline-none"
            />
            {emailFilter && (
              <button
                type="button"
                onClick={() => setEmailFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-[#6B7280] hover:bg-gray-200 hover:text-[#111111] cursor-pointer text-xs"
                aria-label="Limpar filtro de e-mail"
                title="Limpar filtro"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Abas: Floresta | Agrário */}
        <div className="grid grid-cols-2 border-b border-[#E5E7EB] px-6 pt-3 gap-2 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('floresta')}
            className={cn(
              'flex items-center justify-center gap-2 border-b-2 pb-3 pt-1.5 text-[14px] font-semibold transition-colors cursor-pointer',
              isFloresta
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-[#6B7280] hover:text-[#111111]',
            )}
          >
            <span>Dataluta Floresta</span>
            <span
              className={cn(
                'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold',
                isFloresta ? 'bg-[#E9F1EA] text-[#2E7D32]' : 'bg-gray-100 text-[#6B7280]',
              )}
            >
              {florestaItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('agrario')}
            className={cn(
              'flex items-center justify-center gap-2 border-b-2 pb-3 pt-1.5 text-[14px] font-semibold transition-colors cursor-pointer',
              !isFloresta
                ? 'border-[#B45309] text-[#B45309]'
                : 'border-transparent text-[#6B7280] hover:text-[#111111]',
            )}
          >
            <span>Dataluta Agrário</span>
            <span
              className={cn(
                'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold',
                !isFloresta ? 'bg-[#FEF3C7] text-[#B45309]' : 'bg-gray-100 text-[#6B7280]',
              )}
            >
              {agrarioItems.length}
            </span>
          </button>
        </div>

        {/* Lista de submissões */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-[14px] text-[#6B7280]">
              Carregando submissões...
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D1D5DB] px-5 py-10 text-center">
              <p className="text-[14px] font-medium text-[#374151]">
                Nenhuma submissão encontrada em{' '}
                {isFloresta ? 'Dataluta Floresta' : 'Dataluta Agrário'}.
              </p>
              {normalizedEmail && (
                <p className="mt-1 text-[13px] text-[#6B7280]">
                  Filtro ativo: <span className="font-medium">{emailFilter}</span>
                </p>
              )}
            </div>
          ) : (
            visibleItems.map((item) => (
              <div
                key={`${item.modulo}-${item.codigo_noticia}`}
                className="rounded-[14px] border border-[#E5E7EB] bg-white p-4 shadow-2xs transition-colors hover:border-gray-300"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-bold tracking-wide',
                      item.modulo === 'floresta'
                        ? 'bg-[#E9F1EA] text-[#17301D]'
                        : 'bg-[#FEF3C7] text-[#78350F]',
                    )}
                  >
                    {item.codigo_noticia}
                  </span>

                  <span className="text-[12px] text-[#6B7280]">
                    {formatarDataBr(item.data_publicacao)}
                  </span>
                </div>

                <h3 className="mt-2 text-[15px] font-semibold text-[#111111] leading-snug">
                  {item.titulo}
                </h3>

                <p className="mt-1 text-[13px] text-[#4B5563]">
                  {[item.fonte, item.estado].filter(Boolean).join(' • ')}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#F3F4F6] pt-2.5 text-[12px] text-[#6B7280]">
                  <span className="truncate font-medium text-[#374151]">{item.usuario_nome}</span>
                  <button
                    type="button"
                    onClick={() => setEmailFilter(item.usuario_email)}
                    className="truncate text-[#4B5563] hover:text-[#111111] hover:underline cursor-pointer"
                    title="Filtrar por este e-mail"
                  >
                    {item.usuario_email}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}

