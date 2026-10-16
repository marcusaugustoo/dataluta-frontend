import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge precisa conhecer os tamanhos de fonte customizados do
 * tailwind.config.ts; caso contrário trataria `text-label` como cor e
 * removeria `text-ink` (ou vice-versa) ao mesclar classes.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display', 'subtitle', 'section', 'label', 'body', 'helper', 'chip', 'caption', 'micro'] },
      ],
    },
  },
})

/** Concatena classes condicionalmente e resolve conflitos do Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
