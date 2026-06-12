/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bbs-black': 'var(--color-bbs-black)',
        'bbs-gold': 'var(--color-bbs-gold)',
        'bbs-gold-mid': 'var(--color-bbs-gold-mid)',
        'bbs-gold-light': 'var(--color-bbs-gold-light)',
        'bbs-gold-dark': 'var(--color-bbs-gold-dark)',
        'bbs-off-white': 'var(--color-bbs-off-white)',
        'bbs-border': 'var(--color-bbs-border)',

        'status-active-bg': 'var(--color-status-active-bg)',
        'status-active-text': 'var(--color-status-active-text)',
        'status-warn-bg': 'var(--color-status-warn-bg)',
        'status-warn-text': 'var(--color-status-warn-text)',
        'status-error-bg': 'var(--color-status-error-bg)',
        'status-error-text': 'var(--color-status-error-text)',
        'status-info-bg': 'var(--color-status-info-bg)',
        'status-info-text': 'var(--color-status-info-text)',
        'status-completed-bg': 'var(--color-status-completed-bg)',
        'status-completed-text': 'var(--color-status-completed-text)',
      },
      boxShadow: {
        'bbs-card': '0 6px 18px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
