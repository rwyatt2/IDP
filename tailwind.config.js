/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Tinted blacks - midnight violet tint (not pure black)
        void: {
          0: '#010104',      // Deepest - almost black with violet tint
          1: '#020208',      // Primary background
          2: '#04040c',      // Elevated surface
          3: '#080812',      // Cards, panels
          4: '#0c0c18',      // Hover states
          5: '#10101f',      // Active states
        },
        // Surface colors with violet undertone
        surface: {
          0: '#08080f',
          1: '#0a0a12',
          2: '#0f0f18',
          3: '#14141f',
          4: '#1a1a26',
          5: '#20202e',
        },
        // Zinc with slight warm tint
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        // Electric accent - Neon Violet
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Cyber lime for secondary accent
        lime: {
          300: '#d9f99d',
          400: '#ccff00',
          500: '#a3e635',
          600: '#84cc16',
        },
        // Modern semantic colors
        success: {
          bg: '#021a0a',
          border: '#0a3d1c',
          text: '#4ade80',
          muted: '#166534',
          glow: 'rgba(74, 222, 128, 0.15)',
        },
        warning: {
          bg: '#1a0f02',
          border: '#3d2a0a',
          text: '#fbbf24',
          muted: '#854d0e',
          glow: 'rgba(251, 191, 36, 0.15)',
        },
        danger: {
          bg: '#1a0202',
          border: '#3d0a0a',
          text: '#f87171',
          muted: '#991b1b',
          glow: 'rgba(248, 113, 113, 0.15)',
        },
        info: {
          bg: '#020a1a',
          border: '#0a2a4d',
          text: '#60a5fa',
          muted: '#1e40af',
          glow: 'rgba(96, 165, 250, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        'sm': ['0.8125rem', { lineHeight: '1.25rem' }],
        'base': ['0.875rem', { lineHeight: '1.5rem' }],
        'lg': ['1rem', { lineHeight: '1.75rem' }],
        'xl': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '4xl': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        snug: '-0.01em',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.625rem',
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        // Glow effects
        'glow-xs': '0 0 8px -2px var(--tw-shadow-color, rgba(124, 58, 237, 0.4))',
        'glow-sm': '0 0 15px -3px var(--tw-shadow-color, rgba(124, 58, 237, 0.4))',
        'glow': '0 0 25px -5px var(--tw-shadow-color, rgba(124, 58, 237, 0.5))',
        'glow-lg': '0 0 40px -8px var(--tw-shadow-color, rgba(124, 58, 237, 0.5))',
        // Inner highlights
        'inner-highlight': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'inner-highlight-strong': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.03)',
        'inner-glow-accent': 'inset 0 0 30px rgba(124, 58, 237, 0.1)',
        // Depth shadows
        'depth-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.03)',
        'depth': '0 4px 16px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        'depth-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'depth-xl': '0 16px 48px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
      backgroundImage: {
        // Lighting gradients
        'spotlight': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), transparent)',
        'spotlight-lg': 'radial-gradient(ellipse 100% 80% at 50% -30%, rgba(120, 119, 198, 0.2), transparent)',
        'spotlight-accent': 'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(124, 58, 237, 0.15), transparent)',
        'vignette': 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
        // Surface gradients
        'surface-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)',
        // Shimmer
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04), transparent)',
        // Border gradients
        'border-glow': 'linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(204, 255, 0, 0.2), rgba(124, 58, 237, 0.2))',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2.5s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spotlight-pulse': 'spotlightPulse 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        spotlightPulse: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.25' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
