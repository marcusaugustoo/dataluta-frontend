import type { CodeSegment } from '../types/florestaTypes'

interface FlorestaCodeGuideProps {
  title: string
  segments: readonly CodeSegment[]
  example: string
}

export function FlorestaCodeGuide({ title, segments, example }: FlorestaCodeGuideProps) {
  return (
    <aside
      aria-label={title}
      className="flex w-[320px] flex-col items-center rounded-[10px] bg-[#EEF3EE] px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
    >
      <span className="text-[12px] font-bold text-[#222222]">
        {title}
      </span>

      <ol className="mt-2 flex items-start justify-center gap-2">
        {segments.map((segment) => (
          <li key={segment.caption} className="flex flex-col items-center">
            <span
              className={`flex h-[22px] items-center justify-center rounded-[11px] border border-[#333333] bg-white px-2 text-[11px] font-bold text-[#222222] ${
                segment.value.length > 2 ? 'min-w-[44px]' : 'min-w-[34px]'
              }`}
            >
              {segment.value}
            </span>
            <span className="mt-1 text-[10px] text-[#555555]">
              {segment.caption}
            </span>
          </li>
        ))}
      </ol>

      <span className="mt-2 text-[10px] text-[#666666]">
        {example}
      </span>
    </aside>
  )
}

export const CodeGuide = FlorestaCodeGuide
