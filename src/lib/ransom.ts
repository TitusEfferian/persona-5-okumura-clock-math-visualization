/**
 * Ransom-note tile styles for the Persona 5 Royal title treatment.
 * Colours are theme tokens so the paper edge / shadow rims follow the theme.
 */
export type TileFont = 'serif' | 'serif-italic' | 'display' | 'sans' | 'signature'

export interface TileStyle {
  bg: string
  fg: string
  font: TileFont
  /** font-size multiplier of the title's --rs size */
  mult: number
  /** rotation in degrees */
  rot: number
  /** vertical nudge in em */
  ty?: number
  border?: string
  /** overrides the title-wide tile padding */
  pad?: string
  shadow?: string
  ml?: string
  /** Unity-timer red outline around the glyphs */
  outline?: boolean
}

const INK = 'var(--p-black)'
const PAPER = 'var(--p-white)'
const RED = 'var(--color-primary)'
const YEL = 'var(--color-accent)'
const EDGE = '2px solid var(--p-paper-edge)'
const RIM = '2px solid var(--p-white)'

/** One style per letter of "PERSONA5". */
export const PERSONA5: TileStyle[] = [
  { bg: PAPER, fg: INK, border: EDGE, font: 'serif', mult: 1.12, rot: -7, pad: '.04em .14em .02em' },
  { bg: INK, fg: PAPER, border: RIM, font: 'display', mult: 0.92, rot: 5, ty: 0.06 },
  { bg: RED, fg: PAPER, font: 'sans', mult: 0.84, rot: -3, ty: -0.05, pad: '.06em .14em .04em' },
  { bg: PAPER, fg: INK, border: EDGE, font: 'signature', outline: true, mult: 0.9, rot: 4 },
  { bg: INK, fg: PAPER, border: RIM, font: 'serif-italic', mult: 0.98, rot: -5, ty: 0.05, pad: '.02em .12em .04em' },
  { bg: YEL, fg: INK, font: 'sans', mult: 0.88, rot: 6 },
  { bg: RED, fg: INK, font: 'display', mult: 1.02, rot: -4 },
  { bg: RED, fg: PAPER, font: 'serif', mult: 1.42, rot: 8, pad: '0 .16em', ml: '.3em', shadow: '5px 5px 0 var(--p-edge)' },
]

/** Repeating 7-style cycle for any other word (GEOMETRY, VISUALIZATION, 404). */
export const CYCLE: TileStyle[] = [
  { bg: PAPER, fg: INK, border: EDGE, font: 'serif', mult: 1.1, rot: -6 },
  { bg: YEL, fg: INK, font: 'signature', outline: true, mult: 0.88, rot: 4 },
  { bg: RED, fg: INK, font: 'display', mult: 1.02, rot: -4 },
  { bg: RED, fg: PAPER, font: 'sans', mult: 0.86, rot: -3, ty: -0.04 },
  { bg: PAPER, fg: INK, border: EDGE, font: 'sans', mult: 0.9, rot: 6 },
  { bg: INK, fg: PAPER, border: RIM, font: 'signature', mult: 0.8, rot: 5, ty: 0.06 },
  { bg: INK, fg: PAPER, border: RIM, font: 'serif-italic', mult: 0.98, rot: -5, ty: 0.05 },
]

/** "404" in the Unity countdown-timer lettering (Chango, red outline). */
export const TIMER: TileStyle[] = [
  { bg: PAPER, fg: INK, border: EDGE, font: 'signature', outline: true, mult: 1, rot: -5 },
  { bg: YEL, fg: INK, font: 'signature', outline: true, mult: 1.08, rot: 4, ty: 0.04 },
  { bg: PAPER, fg: INK, border: EDGE, font: 'signature', outline: true, mult: 0.96, rot: -3 },
]

export const FONT_FAMILY: Record<TileFont, string> = {
  serif: 'var(--font-serif)',
  'serif-italic': 'var(--font-serif)',
  display: 'var(--font-display)',
  sans: 'var(--font-sans)',
  signature: 'var(--font-signature)',
}
