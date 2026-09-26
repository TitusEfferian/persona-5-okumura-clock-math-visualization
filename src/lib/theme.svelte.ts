export type ThemeName = 'persona5royal' | 'light'

export const THEME_STORAGE_KEY = 'theme'
export const DEFAULT_THEME: ThemeName = 'persona5royal'

function isThemeName(value: unknown): value is ThemeName {
  return value === 'persona5royal' || value === 'light'
}

function initialTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (isThemeName(stored)) return stored
  } catch {
    // localStorage unavailable (private mode, blocked storage); fall through
  }
  return DEFAULT_THEME
}

export const theme = $state<{ current: ThemeName }>({ current: initialTheme() })
