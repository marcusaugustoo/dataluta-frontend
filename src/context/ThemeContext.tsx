import { createContext, useContext, useMemo, type ReactNode } from 'react'

export type FormTheme = 'floresta' | 'agrario'

export interface ThemeColors {
  theme: FormTheme
  primary: string
  primaryHover: string
  primaryActive: string
  accentBg: string
  accentText: string
  badgeBorder: string
  pageBg: string
  focusRing: string
}

const themePresets: Record<FormTheme, ThemeColors> = {
  floresta: {
    theme: 'floresta',
    primary: '#2E7D32',
    primaryHover: '#256829',
    primaryActive: '#1E5220',
    accentBg: '#E9F1EA',
    accentText: '#17301D',
    badgeBorder: '#2E7D32',
    pageBg: '#17301D',
    focusRing: 'focus-visible:ring-[#2E7D32]/40',
  },
  agrario: {
    theme: 'agrario',
    primary: '#B45309',
    primaryHover: '#92400E',
    primaryActive: '#78350F',
    accentBg: '#FEF3C7',
    accentText: '#78350F',
    badgeBorder: '#B45309',
    pageBg: '#23160D',
    focusRing: 'focus-visible:ring-[#B45309]/40',
  },
}

interface ThemeContextValue {
  theme: FormTheme
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'floresta',
  colors: themePresets.floresta,
})

interface ThemeProviderProps {
  theme: FormTheme
  children: ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const value = useMemo(
    () => ({
      theme,
      colors: themePresets[theme],
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useFormTheme() {
  return useContext(ThemeContext)
}
