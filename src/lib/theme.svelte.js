// Light by default; the mark on home switches to dark and back. The choice is
// kept so it holds across pages and visits. index.html applies it before the
// first paint.
const root = document.documentElement

export const theme = $state({ dark: root.dataset.theme === 'dark' })

export function toggleTheme() {
  theme.dark = !theme.dark
  if (theme.dark) root.dataset.theme = 'dark'
  else delete root.dataset.theme
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', theme.dark ? '#141413' : '#f6f4ef')
  try { localStorage.setItem('theme', theme.dark ? 'dark' : 'light') } catch {}
}
