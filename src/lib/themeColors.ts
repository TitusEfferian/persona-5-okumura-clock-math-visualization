export interface ThemeColors {
  base100: string
  base200: string
  base300: string
  baseContent: string
  primary: string
  secondary: string
  accent: string
  neutral: string
  info: string
}

/** Persona 5 daisyUI theme from src/app.css; used when CSS variables cannot be read. */
export const FALLBACK_THEME: ThemeColors = {
  base100: '#0d0d0d',
  base200: '#161616',
  base300: '#222222',
  baseContent: '#f5f5f5',
  primary: '#d92323',
  secondary: '#732424',
  accent: '#f2e852',
  neutral: '#8c6723',
  info: '#3b82f6',
}

const CSS_VARIABLES: Record<keyof ThemeColors, string> = {
  base100: '--color-base-100',
  base200: '--color-base-200',
  base300: '--color-base-300',
  baseContent: '--color-base-content',
  primary: '--color-primary',
  secondary: '--color-secondary',
  accent: '--color-accent',
  neutral: '--color-neutral',
  info: '--color-info',
}

/** Reads the daisyUI theme colors from computed CSS variables, falling back per key. */
export function readThemeColors(el: Element = document.documentElement): ThemeColors {
  const style = getComputedStyle(el)
  const colors = { ...FALLBACK_THEME }
  for (const key of Object.keys(CSS_VARIABLES) as (keyof ThemeColors)[]) {
    const value = style.getPropertyValue(CSS_VARIABLES[key]).trim()
    if (value) colors[key] = value
  }
  return colors
}
