/** @type {import('tailwindcss').Config} */

/**
 * Tailwind CSS Configuration
 * 
 * ARCHITECTURE:
 * All colors and values reference CSS custom properties from design-tokens.css
 * This ensures complete theme isolation - changing tokens updates all components
 * 
 * RULES:
 * 1. NEVER use raw color values (hex, rgb) in components
 * 2. ALWAYS use semantic token names (bg-canvas, text-primary, etc.)
 * 3. Status colors use semantic naming (success, warning, error, info)
 */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // Dark mode controlled by data-theme attribute for manual control
  darkMode: ['selector', '[data-theme="dark"]'],
  
  theme: {
    // ========================================================================
    // COLORS - All mapped to CSS custom properties
    // ========================================================================
    colors: {
      // Primitives
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      white: '#ffffff',
      black: '#000000',
      
      // Canvas - Main backgrounds
      canvas: {
        DEFAULT: 'var(--color-canvas)',
        subtle: 'var(--color-canvas-subtle)',
        inset: 'var(--color-canvas-inset)',
      },
      
      // Surface - Component backgrounds
      surface: {
        DEFAULT: 'var(--color-surface)',
        raised: 'var(--color-surface-raised)',
        overlay: 'var(--color-surface-overlay)',
        popover: 'var(--color-surface-popover)',
      },
      
      // Text hierarchy
      text: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        disabled: 'var(--color-text-disabled)',
        placeholder: 'var(--color-text-placeholder)',
        inverse: 'var(--color-text-inverse)',
        'on-emphasis': 'var(--color-text-on-emphasis)',
      },
      
      // Border system
      border: {
        transparent: 'var(--color-border-transparent)',
        subtle: 'var(--color-border-subtle)',
        DEFAULT: 'var(--color-border-default)',
        strong: 'var(--color-border-strong)',
        emphasis: 'var(--color-border-emphasis)',
      },
      
      // Accent (primary brand color)
      accent: {
        DEFAULT: 'var(--color-accent)',
        hover: 'var(--color-accent-hover)',
        active: 'var(--color-accent-active)',
        subtle: 'var(--color-accent-subtle)',
        muted: 'var(--color-accent-muted)',
        text: 'var(--color-accent-text)',
        border: 'var(--color-accent-border)',
      },
      
      // Success (semantic)
      success: {
        DEFAULT: 'var(--color-success)',
        text: 'var(--color-success-text)',
        subtle: 'var(--color-success-subtle)',
        muted: 'var(--color-success-muted)',
        border: 'var(--color-success-border)',
        emphasis: 'var(--color-success-emphasis)',
      },
      
      // Warning (semantic)
      warning: {
        DEFAULT: 'var(--color-warning)',
        text: 'var(--color-warning-text)',
        subtle: 'var(--color-warning-subtle)',
        muted: 'var(--color-warning-muted)',
        border: 'var(--color-warning-border)',
        emphasis: 'var(--color-warning-emphasis)',
      },
      
      // Error (semantic)
      error: {
        DEFAULT: 'var(--color-error)',
        text: 'var(--color-error-text)',
        subtle: 'var(--color-error-subtle)',
        muted: 'var(--color-error-muted)',
        border: 'var(--color-error-border)',
        emphasis: 'var(--color-error-emphasis)',
      },
      
      // Info (semantic)
      info: {
        DEFAULT: 'var(--color-info)',
        text: 'var(--color-info-text)',
        subtle: 'var(--color-info-subtle)',
        muted: 'var(--color-info-muted)',
        border: 'var(--color-info-border)',
        emphasis: 'var(--color-info-emphasis)',
      },
      
      // Interactive states
      interactive: {
        hover: 'var(--color-interactive-hover)',
        active: 'var(--color-interactive-active)',
        selected: 'var(--color-interactive-selected)',
      },
      
      // Code/terminal
      code: {
        bg: 'var(--color-code-bg)',
        text: 'var(--color-code-text)',
        comment: 'var(--color-code-comment)',
        keyword: 'var(--color-code-keyword)',
        string: 'var(--color-code-string)',
        function: 'var(--color-code-function)',
        variable: 'var(--color-code-variable)',
      },
      
      // Special
      skeleton: {
        DEFAULT: 'var(--color-skeleton)',
        shine: 'var(--color-skeleton-shine)',
      },
      avatar: 'var(--color-avatar-bg)',
      
      // Legacy/compatibility - map old names to new tokens
      // This allows gradual migration without breaking existing code
      primary: {
        50: 'var(--color-accent-subtle)',
        100: 'var(--color-accent-subtle)',
        200: 'var(--color-accent-muted)',
        300: 'var(--color-accent-muted)',
        400: 'var(--color-accent-text)',
        500: 'var(--color-accent)',
        600: 'var(--color-accent)',
        700: 'var(--color-accent-hover)',
        800: 'var(--color-accent-active)',
        900: 'var(--color-accent-active)',
      },
      danger: {
        50: 'var(--color-error-subtle)',
        100: 'var(--color-error-subtle)',
        200: 'var(--color-error-muted)',
        500: 'var(--color-error)',
        600: 'var(--color-error)',
        700: 'var(--color-error-emphasis)',
        800: 'var(--color-error-emphasis)',
      },
    },
    
    // ========================================================================
    // TYPOGRAPHY
    // ========================================================================
    fontFamily: {
      sans: ['var(--font-sans)'],
      mono: ['var(--font-mono)'],
    },
    
    fontSize: {
      '2xs': ['var(--text-2xs)', { lineHeight: '1.25' }],
      'xs': ['var(--text-xs)', { lineHeight: '1.4' }],
      'sm': ['var(--text-sm)', { lineHeight: '1.45' }],
      'base': ['var(--text-base)', { lineHeight: '1.5' }],
      'lg': ['var(--text-lg)', { lineHeight: '1.5' }],
      'xl': ['var(--text-xl)', { lineHeight: '1.4' }],
      '2xl': ['var(--text-2xl)', { lineHeight: '1.35' }],
      '3xl': ['var(--text-3xl)', { lineHeight: '1.3' }],
      '4xl': ['var(--text-4xl)', { lineHeight: '1.25' }],
      '5xl': ['var(--text-5xl)', { lineHeight: '1.2' }],
      '6xl': ['var(--text-6xl)', { lineHeight: '1.1' }],
    },
    
    fontWeight: {
      normal: 'var(--font-normal)',
      medium: 'var(--font-medium)',
      semibold: 'var(--font-semibold)',
      bold: 'var(--font-bold)',
    },
    
    letterSpacing: {
      tighter: 'var(--tracking-tighter)',
      tight: 'var(--tracking-tight)',
      normal: 'var(--tracking-normal)',
      wide: 'var(--tracking-wide)',
      wider: 'var(--tracking-wider)',
    },
    
    lineHeight: {
      none: 'var(--leading-none)',
      tight: 'var(--leading-tight)',
      snug: 'var(--leading-snug)',
      normal: 'var(--leading-normal)',
      relaxed: 'var(--leading-relaxed)',
      loose: 'var(--leading-loose)',
    },
    
    // ========================================================================
    // SPACING
    // ========================================================================
    spacing: {
      '0': 'var(--space-0)',
      'px': 'var(--space-px)',
      '0.5': 'var(--space-0-5)',
      '1': 'var(--space-1)',
      '1.5': 'var(--space-1-5)',
      '2': 'var(--space-2)',
      '2.5': 'var(--space-2-5)',
      '3': 'var(--space-3)',
      '3.5': 'var(--space-3-5)',
      '4': 'var(--space-4)',
      '5': 'var(--space-5)',
      '6': 'var(--space-6)',
      '7': 'var(--space-7)',
      '8': 'var(--space-8)',
      '9': 'var(--space-9)',
      '10': 'var(--space-10)',
      '11': 'var(--space-11)',
      '12': 'var(--space-12)',
      '14': 'var(--space-14)',
      '16': 'var(--space-16)',
      '20': 'var(--space-20)',
      '24': 'var(--space-24)',
      '28': 'var(--space-28)',
      '32': 'var(--space-32)',
    },
    
    // ========================================================================
    // BORDER RADIUS
    // ========================================================================
    borderRadius: {
      'none': 'var(--radius-none)',
      'sm': 'var(--radius-sm)',
      DEFAULT: 'var(--radius-md)',
      'md': 'var(--radius-md)',
      'lg': 'var(--radius-lg)',
      'xl': 'var(--radius-xl)',
      '2xl': 'var(--radius-2xl)',
      '3xl': 'var(--radius-3xl)',
      'full': 'var(--radius-full)',
    },
    
    // ========================================================================
    // BOX SHADOW
    // ========================================================================
    boxShadow: {
      'none': 'none',
      'xs': 'var(--shadow-xs)',
      'sm': 'var(--shadow-sm)',
      DEFAULT: 'var(--shadow-md)',
      'md': 'var(--shadow-md)',
      'lg': 'var(--shadow-lg)',
      'xl': 'var(--shadow-xl)',
      '2xl': 'var(--shadow-2xl)',
      'inner': 'var(--shadow-inner)',
      'accent': 'var(--shadow-accent)',
      'success': 'var(--shadow-success)',
      'error': 'var(--shadow-error)',
      'focus': 'var(--shadow-focus)',
      'focus-error': 'var(--shadow-focus-error)',
      'highlight': 'var(--shadow-highlight)',
    },
    
    // ========================================================================
    // Z-INDEX
    // ========================================================================
    zIndex: {
      'hide': 'var(--z-hide)',
      '0': 'var(--z-base)',
      '10': 'var(--z-raised)',
      'dropdown': 'var(--z-dropdown)',
      'sticky': 'var(--z-sticky)',
      'banner': 'var(--z-banner)',
      'overlay': 'var(--z-overlay)',
      'modal': 'var(--z-modal)',
      'popover': 'var(--z-popover)',
      'tooltip': 'var(--z-tooltip)',
      'toast': 'var(--z-toast)',
      'max': 'var(--z-max)',
    },
    
    // ========================================================================
    // TRANSITIONS
    // ========================================================================
    transitionDuration: {
      '0': 'var(--duration-instant)',
      '75': '75ms',
      '100': 'var(--duration-fast)',
      '150': 'var(--duration-normal)',
      '200': 'var(--duration-slow)',
      '300': 'var(--duration-slower)',
      '500': 'var(--duration-slowest)',
      '700': '700ms',
      '1000': '1000ms',
    },
    
    transitionTimingFunction: {
      'linear': 'var(--ease-linear)',
      'in': 'var(--ease-in)',
      'out': 'var(--ease-out)',
      'in-out': 'var(--ease-in-out)',
      'spring': 'var(--ease-spring)',
      'bounce': 'var(--ease-bounce)',
    },
    
    // ========================================================================
    // EXTEND (additions to defaults)
    // ========================================================================
    extend: {
      // Additional utilities
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-out': 'fadeOut 150ms ease-in',
        'slide-up': 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 200ms ease-out',
        'slide-left': 'slideLeft 200ms ease-out',
        'slide-right': 'slideRight 200ms ease-out',
        'scale-in': 'scaleIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-out': 'scaleOut 100ms ease-in',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 1.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-8px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.7' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: '1' },
        },
      },
      
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },
      
      // Max width for readability
      maxWidth: {
        'prose': '65ch',
        'content': '90rem',
      },
      
      // Aspect ratios
      aspectRatio: {
        'video': '16 / 9',
        'square': '1 / 1',
        'portrait': '3 / 4',
      },
    },
  },
  
  // ========================================================================
  // PLUGINS
  // ========================================================================
  plugins: [
    // Custom plugin for theme-aware utilities
    function({ addUtilities, addComponents }) {
      // Focus visible ring utility
      addUtilities({
        '.focus-ring': {
          '@apply outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas': {},
        },
        '.focus-ring-inset': {
          '@apply outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset': {},
        },
      });
      
      // Glass morphism utilities
      addUtilities({
        '.glass': {
          '@apply bg-surface/80 backdrop-blur-md border border-border-subtle': {},
        },
        '.glass-heavy': {
          '@apply bg-surface/90 backdrop-blur-xl border border-border-default': {},
        },
      });
      
      // Text balance utility
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
      });
      
      // Scrollbar utilities
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--color-border-default)',
            borderRadius: '9999px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'var(--color-border-strong)',
          },
        },
        '.scrollbar-none': {
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};
