import JXG from 'jsxgraph'
import type { QuadCorners } from './taperedQuad'

export interface JsxPalette {
  /** Primary text, corner markers, borders. */
  ink: string
  /** Secondary text, construction lines, axis labels. */
  secondaryInk: string
  /** Main tapered quad fill. */
  quad: string
  /** Axes and ticks. */
  grid: string
  /** Board background; used for cut-outs drawn on top of the quad. */
  panel: string
  /** Base-end cut line, midpoint, triangle B. */
  baseCut: string
  /** Tip-end cut line, midpoint, triangle A. */
  tipCut: string
}

/**
 * Colors are CSS custom properties, not resolved hex values. JSXGraph 1.13's SVG
 * renderer writes any color string that is not a 9-character #rrggbbaa verbatim
 * into `stroke` / `fill` / `style.color`, with opacity kept in the separate
 * `-opacity` attributes, so `var(--color-*)` is passed through untouched and the
 * browser resolves it against the active daisyUI `data-theme`. Switching themes
 * re-colors every board with zero JS. This is safe because the app only uses the
 * SVG renderer: no canvas renderer, image export, or color animation, which would
 * need real color values.
 */
export const PALETTE: JsxPalette = {
  ink: 'var(--color-base-content)',
  secondaryInk: 'var(--color-neutral)',
  quad: 'var(--color-primary)',
  grid: 'var(--color-base-300)',
  panel: 'var(--color-base-100)',
  baseCut: 'var(--p5-base-cut)',
  tipCut: 'var(--p5-tip-cut)',
}

export const FONT_CSS = 'font-family:"IBM Plex Mono",monospace;'

export function createAxisAttributes(p: JsxPalette): JXG.AxisAttributes {
  const label: JXG.LabelOptions & { cssDefaultStyle: string } = {
    fontSize: 10, strokeColor: p.secondaryInk, display: 'internal', cssDefaultStyle: FONT_CSS, highlight: false,
  }
  return {
    strokeColor: p.grid, highlightStrokeColor: p.grid, highlight: false,
    ticks: { strokeColor: p.grid, highlightStrokeColor: p.grid, minorTicks: 1, majorHeight: 6, label },
  }
}

export function createQuad(board: JXG.Board, getQuadCorners: () => QuadCorners, p: JsxPalette) {
  return board.create('polygon', [() => getQuadCorners().bottomLeft, () => getQuadCorners().topLeft, () => getQuadCorners().topRight, () => getQuadCorners().bottomRight], {
    fillColor: p.quad, fillOpacity: 0.85, highlightFillColor: p.quad, highlightFillOpacity: 0.85, highlight: false,
    borders: { strokeColor: p.quad, highlightStrokeColor: p.quad, strokeWidth: 1, highlight: false }, vertices: { visible: false },
  })
}

export function createLabel(board: JXG.Board, positionX: number, positionY: number, labelText: string | (() => string), p: JsxPalette, extraAttributes?: JXG.TextAttributes) {
  return board.create('text', [positionX, positionY, labelText], {
    fontSize: 12, anchorX: 'middle', anchorY: 'middle', highlight: false, parse: false,
    strokeColor: p.ink, highlightStrokeColor: p.ink, cssDefaultStyle: FONT_CSS, display: 'internal', ...extraAttributes,
  })
}

export function createCornerMarker(board: JXG.Board, position: [number, number], p: JsxPalette) {
  return board.create('point', position, {
    fixed: true, size: 3, strokeColor: p.ink, fillColor: p.ink, highlightStrokeColor: p.ink, highlightFillColor: p.ink,
    highlight: false, showInfobox: false, withLabel: false,
  })
}
