import type { CodeSegment } from '../types/agrarioTypes'

interface AgrarioCodeGuideProps {
  title: string
  segments: readonly CodeSegment[]
  example: string
}

export function AgrarioCodeGuide({ title, segments, example }: AgrarioCodeGuideProps) {
  return (
    <aside
      aria-label={title}
      className="flex w-[340px] flex-col items-center rounded-[10px] bg-[#FEF3C7]/70 border border-[#FDE68A] px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <span className="text-[12px] font-bold text-[#78350F]">
        {title}
      </span>

      <ol className="mt-2 flex items-start justify-center gap-1.5">
        {segments.map((segment) => (
          <li key={segment.caption} className="flex flex-col items-center">
            <span
              className={`flex h-[22px] items-center justify-center rounded-[11px] border border-[#78350F] bg-white px-2 text-[11px] font-bold text-[#78350F] ${
                segment.value.length > 2 ? 'min-w-[44px]' : 'min-w-[32px]'
              }`}
            >
              {segment.value}
            </span>
            <span className="mt-1 text-[10px] text-[#92400E] font-medium">
              {segment.caption}
            </span>
          </li>
        ))}
      </ol>

      <span className="mt-2 text-[11px] font-medium text-[#78350F]">
        {example}
      </span>
    </aside>
  )
}
