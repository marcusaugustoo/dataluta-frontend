import bannerUrl from '../../assets/images/banner-exact.png'

interface BrandHeaderProps {
  title?: string
  subtitle?: string
}

/**
 * Banner oficial do Figma exportado em alta fidelidade.
 */
export function BrandHeader({
  title = 'Dataluta Floresta',
  subtitle = 'Formulário para cadastro de notícias',
}: BrandHeaderProps) {
  return (
    <header className="w-full overflow-hidden rounded-[14px] shadow-sm">
      <img
        src={bannerUrl}
        alt={`${title} - ${subtitle}`}
        className="w-full h-auto object-contain select-none block"
      />
    </header>
  )
}
