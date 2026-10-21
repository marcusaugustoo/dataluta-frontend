interface HubHomePageProps {
  onSelectForm: (form: 'floresta' | 'agrario') => void
}

export function HubHomePage({ onSelectForm }: HubHomePageProps) {
  return (
    <div className="min-h-screen w-full bg-white text-[#111111] flex flex-col justify-between px-6 py-8 md:px-12 md:py-10 selection:bg-gray-100">
      <header className="w-full">
        <span className="font-extrabold text-[15px] md:text-[16px] tracking-wider text-[#111111] uppercase select-none">
          DATALUTA
        </span>
      </header>

      <main className="my-auto w-full max-w-4xl mx-auto flex flex-col items-center text-center py-12">
        <h1 className="text-[28px] sm:text-[32px] md:text-[38px] font-bold text-[#111111] tracking-tight leading-tight">
          Qual formulário você deseja preencher?
        </h1>

        <p className="mt-2 text-[14px] sm:text-[15px] md:text-[16px] text-[#6B7280] font-normal">
          Selecione a base para iniciar o cadastro.
        </p>

        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-stretch justify-center gap-5 md:gap-6 w-full max-w-[720px] text-left">
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectForm('floresta')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectForm('floresta')
              }
            }}
            className="group flex-1 flex flex-col justify-between rounded-[20px] border border-[#E5E7EB] bg-white p-6 md:p-7 transition-all duration-200 hover:border-gray-300 hover:shadow-md cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
          >
            <div>
              <h2 className="text-[18px] md:text-[20px] font-bold text-[#111111] group-hover:text-[#2E7D32] transition-colors">
                Dataluta Floresta
              </h2>
              <p className="mt-2 text-[13px] md:text-[14px] text-[#6B7280] leading-relaxed">
                Conflitos e notícias socioambientais: povos tradicionais, quilombolas e biomas.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-[14px] font-semibold text-[#2E7D32] group-hover:translate-x-0.5 transition-transform">
              <span>Preencher</span>
              <span className="text-[15px] leading-none">→</span>
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectForm('agrario')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectForm('agrario')
              }
            }}
            className="group flex-1 flex flex-col justify-between rounded-[20px] border border-[#E5E7EB] bg-white p-6 md:p-7 transition-all duration-200 hover:border-gray-300 hover:shadow-md cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#C2410C]/30"
          >
            <div>
              <h2 className="text-[18px] md:text-[20px] font-bold text-[#111111] group-hover:text-[#C2410C] transition-colors">
                Dataluta Agrário
              </h2>
              <p className="mt-2 text-[13px] md:text-[14px] text-[#6B7280] leading-relaxed">
                Luta pela terra: ocupações, assentamentos e movimentos camponeses.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-[14px] font-semibold text-[#C2410C] group-hover:translate-x-0.5 transition-transform">
              <span>Preencher</span>
              <span className="text-[15px] leading-none">→</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full text-center pb-2">
        <p className="text-[12px] md:text-[13px] text-[#9CA3AF] font-normal">
          Banco de Dados da Luta pela Terra - UNESP
        </p>
      </footer>
    </div>
  )
}

export default HubHomePage
