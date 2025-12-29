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
        'base-blue': '#0052FF',
        'base-blue-dark': '#0033CC',
        'base-bg': '#0A0B0D',
        'base-card': '#141519',
        'base-border': '#2A2D36',
        'base-text': '#E5E7EB',
        'base-muted': '#9CA3AF',
        'base-accent': '#00D4FF',
        'base-success': '#10B981',
        'base-warning': '#F59E0B',
        'base-error': '#EF4444',
      },
      fontFamily: {
        'display': ['Satoshi', 'system-ui', 'sans-serif'],
        'body': ['General Sans', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-base': 'linear-gradient(135deg, #0052FF 0%, #00D4FF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0B0D 0%, #141519 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(212, 100%, 50%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 50%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(212, 100%, 50%, 0.2) 0px, transparent 50%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 82, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config


