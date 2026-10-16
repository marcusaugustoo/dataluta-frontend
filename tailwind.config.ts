import type { Config } from 'tailwindcss'

/**
 * Design tokens extraídos do Figma ("Section 1.pdf").
 * Valores medidos no frame original (1 unidade Figma = 1px CSS).
 * Cores amostradas diretamente dos pixels do PDF renderizado.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2F7D32', // header, stepper ativo, botão primário
          soft: '#78AA7A', // anti-alias / hover suave
          surface: '#E9F1EA', // caixa "Ordem do código"
          border: '#D5DCD6',
        },
        forest: {
          950: '#17301D', // fundo da página (frame Login)
        },
        canvas: '#1E1E1E', // fundo neutro do Figma
        ink: {
          DEFAULT: '#4B4B4B', // labels, textos, bordas de input
          strong: '#1E1E1E', // "Ordem do código", chips
        },
        muted: '#757575', // placeholders e helper texts
        line: {
          DEFAULT: '#D5D5D5', // divisores horizontais
          soft: '#E8E8E8',
        },
        danger: '#D32F2F', // asterisco de campo obrigatório / erros
      },
      fontFamily: {
        display: ['"Zilla Slab"', 'Georgia', 'serif'], // "Dataluta Floresta"
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // [size, { lineHeight, letterSpacing }]
        display: ['36px', { lineHeight: '40px', fontWeight: '700' }], // Zilla Slab
        subtitle: ['20px', { lineHeight: '24px' }], // Zilla Slab
        section: ['18px', { lineHeight: '22px', fontWeight: '700' }],
        label: ['16px', { lineHeight: '20px', fontWeight: '500' }],
        body: ['16px', { lineHeight: '20px' }],
        helper: ['13px', { lineHeight: '16px', fontWeight: '300' }],
        chip: ['12px', { lineHeight: '14px', fontWeight: '500' }],
        caption: ['10px', { lineHeight: '12px' }],
        micro: ['8px', { lineHeight: '10px' }],
      },
      spacing: {
        'field-y': '24px', // gap vertical entre campos
        'label-gap': '8px', // label -> input
        'card-x': '60px', // padding horizontal do card
        'card-y': '40px', // padding vertical do card
      },
      width: {
        card: '1020px',
        content: '900px',
        'field-half': '410px',
        'field-third': '280px',
        'field-short': '300px',
        'field-wide': '590px',
        button: '180px',
      },
      maxWidth: {
        card: '1020px',
        content: '900px',
      },
      height: {
        header: '110px',
        field: '40px',
        button: '36px',
        step: '30px',
        chip: '20px',
      },
      borderRadius: {
        field: '8px',
        button: '8px',
        header: '12px',
        card: '48px',
      },
      boxShadow: {
        dropdown: '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}

export default config
