import JXG from 'jsxgraph'
import type { QuadCorners } from './taperedQuad'

export const inkColor = '#151312'
export const secondaryInkColor = '#5a554f'
export const quadColor = '#e3121b'
export const gridColor = '#e6e1d8'

export const FONT_CSS = 'font-family:"IBM Plex Mono",monospace;'

export function createAxisAttributes(): JXG.AxisAttributes {
  const label: JXG.LabelOptions & { cssDefaultStyle: string } = {
    fontSize: 10, strokeColor: secondaryInkColor, display: 'internal', cssDefaultStyle: FONT_CSS, highlight: false,
  }
  return { strokeColor: gridColor, highlight: false, ticks: { strokeColor: gridColor, minorTicks: 1, majorHeight: 6, label } }
}

export function createQuad(board: JXG.Board, getQuadCorners: () => QuadCorners) {
  return board.create('polygon', [() => getQuadCorners().bottomLeft, () => getQuadCorners().topLeft, () => getQuadCorners().topRight, () => getQuadCorners().bottomRight], {
    fillColor: quadColor, fillOpacity: 0.85, highlight: false,
    borders: { strokeColor: quadColor, strokeWidth: 1, highlight: false }, vertices: { visible: false },
  })
}

export function createLabel(board: JXG.Board, positionX: number, positionY: number, labelText: string | (() => string), extraAttributes?: JXG.TextAttributes) {
  return board.create('text', [positionX, positionY, labelText], {
    fontSize: 12, anchorX: 'middle', anchorY: 'middle', highlight: false, parse: false,
    strokeColor: inkColor, cssDefaultStyle: FONT_CSS, display: 'internal', ...extraAttributes,
  })
}

export function createCornerMarker(board: JXG.Board, position: [number, number]) {
  return board.create('point', position, {
    fixed: true, size: 3, strokeColor: inkColor, fillColor: inkColor, highlight: false, showInfobox: false, withLabel: false,
  })
}
