import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#050505',
          dark: '#030014',
        },
        text: {
          DEFAULT: '#e0e0e0',
          muted: '#cdcccc',
          'muted-dark': '#8f8f8f',
          dim: '#ada6a6',
        },
        gold: {
          DEFAULT: '#ddceaf',
          dark: '#d2ae4a',
        },
        card: {
          DEFAULT: '#0e1a1e',
          light: '#f8f6f0',
        },
        border: '#4b4b4b',
        glass: 'rgba(6,6,6,0.5)',
      },
      fontFamily: {
        sans: ['var(--font-general-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-agbalumo)', 'cursive'],
        mono: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        serif: ['var(--font-nanum-myeongjo)', 'Georgia', 'Cambria', 'serif'],
      },
      fontSize: {
        hero: ['128px', { lineHeight: '1.1', fontWeight: '700' }],
        'hero-mobile': ['64px', { lineHeight: '1.1', fontWeight: '700' }],
      },
      boxShadow: {
        'hero-text': '12px 10px 9px rgba(0,0,0,0.85)',
        card: '16px 14px 24px rgba(0,0,0,0.44)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        glass: '100px',
        nav: '12px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-section': 'linear-gradient(to bottom, rgba(3,0,20,0.8), rgba(5,5,5,1))',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 1.2s ease-out forwards',
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee 30s linear infinite reverse',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config

