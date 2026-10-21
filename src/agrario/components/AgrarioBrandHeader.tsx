interface AgrarioBrandHeaderProps {
  title?: string
  subtitle?: string
}


export function AgrarioBrandHeader({
  title = 'Dataluta Agrário',
  subtitle = 'Formulário para cadastro de notícias',
}: AgrarioBrandHeaderProps) {
  return (
    <header className="w-full overflow-hidden rounded-[14px] shadow-sm select-none">
      <div className="relative w-full aspect-[1799/220] bg-gradient-to-r from-[#5C2E0B] via-[#85440F] to-[#B45309] flex items-center px-4 md:px-8 overflow-hidden">
        <svg
          viewBox="0 0 1799 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          preserveAspectRatio="none"
        >
          <path
            d="M-50 180 C 400 130, 900 240, 1850 150"
            stroke="#FEF3C7"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <path
            d="M-20 140 C 500 90, 1100 200, 1850 110"
            stroke="#FEF3C7"
            strokeWidth="2.5"
          />
          <path
            d="M0 210 C 600 160, 1200 230, 1850 190"
            stroke="#FEF3C7"
            strokeWidth="2"
          />
          <g opacity="0.6">
            <ellipse cx="1200" cy="160" rx="14" ry="7" transform="rotate(-25 1200 160)" fill="#FDE68A" />
            <ellipse cx="1280" cy="140" rx="15" ry="7" transform="rotate(30 1280 140)" fill="#FDE68A" />
            <ellipse cx="1360" cy="130" rx="16" ry="8" transform="rotate(-20 1360 130)" fill="#FDE68A" />
            <ellipse cx="1440" cy="120" rx="15" ry="7" transform="rotate(35 1440 120)" fill="#FDE68A" />
            <ellipse cx="1520" cy="115" rx="16" ry="8" transform="rotate(-15 1520 115)" fill="#FDE68A" />
            <ellipse cx="1600" cy="110" rx="17" ry="8" transform="rotate(25 1600 110)" fill="#FDE68A" />
            <ellipse cx="1680" cy="105" rx="16" ry="8" transform="rotate(-25 1680 105)" fill="#FDE68A" />
            <ellipse cx="1750" cy="95" rx="15" ry="7" transform="rotate(30 1750 95)" fill="#FDE68A" />
          </g>
        </svg>

        <div className="relative z-10 flex items-center gap-3.5 md:gap-5">
          <div className="flex h-12 w-12 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-md">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 md:h-9 md:w-9 text-[#85440F]"
            >
              <path
                d="M16 26V9"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M16 11C13.5 10 11.5 12 11.5 14C13.5 14 15.5 13 16 11Z"
                fill="currentColor"
              />
              <path
                d="M16 11C18.5 10 20.5 12 20.5 14C18.5 14 16.5 13 16 11Z"
                fill="currentColor"
              />
              <path
                d="M16 15C13.5 14 11.5 16 11.5 18C13.5 18 15.5 17 16 15Z"
                fill="currentColor"
              />
              <path
                d="M16 15C18.5 14 20.5 16 20.5 18C18.5 18 16.5 17 16 15Z"
                fill="currentColor"
              />
              <path
                d="M16 19C13.5 18 11.5 20 11.5 22C13.5 22 15.5 21 16 19Z"
                fill="currentColor"
              />
              <path
                d="M16 19C18.5 18 20.5 20 20.5 22C18.5 22 16.5 21 16 19Z"
                fill="currentColor"
              />
              <path
                d="M7 26C10 24 13 25 16 25C19 25 22 24 25 26"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex flex-col text-white">
            <h1 className="font-display text-[22px] md:text-[34px] font-bold leading-tight tracking-tight drop-shadow-xs">
              {title}
            </h1>
            <p className="text-[12px] md:text-[15px] font-normal text-[#FEF3C7] tracking-wide opacity-95">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
