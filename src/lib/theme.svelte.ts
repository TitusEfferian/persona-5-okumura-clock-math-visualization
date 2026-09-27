export type Theme = 'persona5dark' | 'persona5light'

export const THEME_STORAGE_KEY = 'theme'

const isTheme = (v: unknown): v is Theme => v === 'persona5dark' || v === 'persona5light'

/** Resolves the initial theme: the pre-paint script's choice, then storage, then the OS preference. */
function initial(): Theme {
  const applied = document.documentElement.dataset.theme
  if (isTheme(applied)) return applied
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (isTheme(stored)) return stored
  } catch {
    /* storage unavailable (private mode, blocked) */
  }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'persona5dark' : 'persona5light'
}

export const theme = $state<{ current: Theme }>({ current: initial() })

export function setTheme(next: Theme) {
  // Apply to the DOM synchronously, before the reactive write, so CSS re-themes immediately.
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next)
  } catch {
    /* storage unavailable */
  }
  theme.current = next
}

export function toggleTheme() {
  setTheme(theme.current === 'persona5dark' ? 'persona5light' : 'persona5dark')
}

setTheme(theme.current)
