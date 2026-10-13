/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
        ink: 'var(--ink)',
        accent: 'var(--accent)',
        correct: 'var(--correct)',
        'correct-bg': 'var(--correct-bg)',
        wrong: 'var(--wrong)',
        'wrong-bg': 'var(--wrong-bg)',
        marked: 'var(--marked)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        'label': ['13px', { lineHeight: '1.5' }],
        'body': ['15px', { lineHeight: '1.6' }],
        'question': ['17px', { lineHeight: '1.5' }],
        'section': ['20px', { lineHeight: '1.35' }],
        'title': ['24px', { lineHeight: '1.3' }],
        'score': ['32px', { lineHeight: '1.2' }],
      },
      borderRadius: {
        'card': '8px',
        'button': '8px',
        'input': '6px',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
      },
    },
  },
}