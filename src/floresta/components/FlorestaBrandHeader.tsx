import bannerUrl from '../../assets/images/banner-exact.png'

interface FlorestaBrandHeaderProps {
  title?: string
  subtitle?: string
}

export function FlorestaBrandHeader({
  title = 'Dataluta Floresta',
  subtitle = 'Formulário para cadastro de notícias',
}: FlorestaBrandHeaderProps) {
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

export const BrandHeader = FlorestaBrandHeader
