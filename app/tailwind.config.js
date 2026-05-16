const colorTokens = {
  'bg-base': 'var(--bg-base)',
  'bg-page': 'var(--bg-page)',
  'bg-surface': 'var(--bg-surface)',
  'bg-elevated': 'var(--bg-elevated)',
  'bg-sunken': 'var(--bg-sunken)',
  'bg-music': 'var(--bg-music)',
  'bg-image': 'var(--bg-image)',
  paper: 'var(--bg-base)',
  'surface-page': 'var(--bg-page)',
  'surface-card': 'var(--bg-surface)',
  'surface-muted': 'var(--bg-sunken)',
  'composer-bar': 'var(--bg-composer-bar)',
  'fg-1': 'var(--fg-1)',
  'fg-2': 'var(--fg-2)',
  'fg-3': 'var(--fg-3)',
  'fg-4': 'var(--fg-4)',
  'stroke-1': 'var(--stroke-1)',
  'stroke-2': 'var(--stroke-2)',
  'stroke-3': 'var(--stroke-3)',
  'accent-blue': 'var(--accent-blue)',
  darkteal: {
    50: 'var(--darkteal-50)',
    300: 'var(--darkteal-300)',
    500: 'var(--darkteal-500)',
    700: 'var(--darkteal-700)',
    900: 'var(--darkteal-900)'
  },
  blue: {
    50: 'var(--blue-50)',
    300: 'var(--blue-300)',
    500: 'var(--blue-500)',
    700: 'var(--blue-700)',
    900: 'var(--blue-900)'
  },
  gold: {
    50: 'var(--gold-50)',
    100: 'var(--gold-100)',
    200: 'var(--gold-200)',
    300: 'var(--gold-300)',
    500: 'var(--gold-500)',
    700: 'var(--gold-700)',
    900: 'var(--gold-900)'
  },
  silver: {
    50: 'var(--silver-50)',
    100: 'var(--silver-100)',
    300: 'var(--silver-300)',
    500: 'var(--silver-500)',
    700: 'var(--silver-700)',
    900: 'var(--silver-900)'
  },
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  info: 'var(--info)'
};

module.exports = {
  content: ['./app/**/*.{js,jsx,mdx}', './app/src/**/*.{js,jsx,mdx}'],
  theme: {
    extend: {
      colors: colorTokens,
      fontFamily: {
        muna: ['var(--font-ui)'],
        arabic: ['var(--font-ui)'],
        naskh: ['var(--font-ui)'],
        compact: ['var(--font-compact)'],
        ruqaa: ['var(--font-ruqaa)'],
        mono: ['var(--font-mono)']
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)'
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        inset: 'var(--shadow-inset)',
        focus: 'var(--shadow-focus)',
        'focus-danger': 'var(--shadow-focus-danger)'
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out',
        'slide-up': 'slide-up 400ms cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-out': 'fade-out 200ms ease-in'
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(var(--sp-2))' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' }
        }
      }
    }
  },
  plugins: []
};
