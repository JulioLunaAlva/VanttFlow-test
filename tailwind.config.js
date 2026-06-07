/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT:    "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT:    "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
      },
      fontFamily: {
        outfit: ["Outfit", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        sans:   ["Outfit", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        'display': ['clamp(1.75rem, 5vw, 2.5rem)', {
          lineHeight: '1.05',
          fontWeight: '900',
          letterSpacing: '-0.035em',
        }],
        'title': ['clamp(1.1rem, 3vw, 1.375rem)', {
          lineHeight: '1.2',
          fontWeight: '800',
          letterSpacing: '-0.02em',
        }],
        'amount-xl': ['clamp(2rem, 8vw, 3.5rem)', {
          lineHeight: '1',
          fontWeight: '900',
          letterSpacing: '-0.04em',
        }],
        'amount-lg': ['clamp(1.5rem, 4vw, 2rem)', {
          lineHeight: '1.05',
          fontWeight: '900',
          letterSpacing: '-0.035em',
        }],
        'amount-md': ['clamp(1.1rem, 3vw, 1.4rem)', {
          lineHeight: '1.1',
          fontWeight: '800',
          letterSpacing: '-0.025em',
        }],
      },
      borderRadius: {
        'DEFAULT': 'var(--radius)',
        'sm':  'calc(var(--radius) * 0.5)',
        'md':  'var(--radius)',
        'lg':  'calc(var(--radius) * 1.5)',
        'xl':  'calc(var(--radius) * 2)',
        '2xl': 'calc(var(--radius) * 2.5)',
        '3xl': 'calc(var(--radius) * 3)',
      },
      animation: {
        'spin-slow':    'spin 8s linear infinite',
        'bounce-slow':  'bounce 3s ease-in-out infinite',
        'float':        'float 7s ease-in-out infinite',
        'fade-scale':   'fade-scale 0.22s cubic-bezier(0.16,1,0.3,1)',
        'slide-up':     'slide-up 0.3s cubic-bezier(0.16,1,0.3,1)',
        'pulse-dot':    'pulse-dot 2s ease-in-out infinite',
        'shake':        'shake 0.28s cubic-bezier(.36,.07,.19,.97) both',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'glow':         '0 0 30px hsl(var(--primary) / 0.3)',
        'glow-sm':      '0 0 15px hsl(var(--primary) / 0.25)',
        'card':         '0 4px 24px rgba(0,0,0,0.08)',
        'card-dark':    '0 4px 32px rgba(0,0,0,0.4)',
        'card-hover':   '0 8px 40px rgba(0,0,0,0.12)',
        '3xl':          '0 40px 80px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
