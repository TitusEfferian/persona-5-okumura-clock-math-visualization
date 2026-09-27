import JXG from 'jsxgraph'
import { FONT_CSS } from './jsxgraphTheme'

export type Point2 = [number, number]
export type CornerSource = JXG.Point | (() => Point2)

export interface UnitCircleOverlayOptions {
  /**
   * Also draw the right-angle legs from the centre to the tangent foot and up to the corner
   * (for boards that do not already draw them). Defaults to false.
   */
  showRise?: boolean
}

function isJsxPoint(source: CornerSource | Point2 | (() => Point2)): source is JXG.Point {
  return typeof source === 'object' && !Array.isArray(source) && typeof (source as JXG.Point).X === 'function'
}

function toGetters(source: JXG.Point | Point2 | (() => Point2)): { x: () => number; y: () => number } {
  if (isJsxPoint(source)) return { x: () => source.X(), y: () => source.Y() }
  if (Array.isArray(source)) return { x: () => source[0], y: () => source[1] }
  return { x: () => source()[0], y: () => source()[1] }
}

/**
 * Draw the unit-circle picture of tan θ around a cut-line midpoint: a circle through the
 * corner's x, a dashed vertical tangent line at that x, and a 'tan θ' label on the rise.
 * All coordinates are function-based so the overlay follows the corner (and a moving centre)
 * on each `board.update()`. Toggle visibility through the `visible` closure only.
 */
export function createUnitCircleOverlay(
  board: JXG.Board,
  center: Point2 | (() => Point2),
  corner: CornerSource,
  color: string,
  visible: () => boolean,
  options: UnitCircleOverlayOptions = {},
): JXG.GeometryElement[] {
  const { x: cx, y: cy } = toGetters(center)
  const { x: tx, y: ty } = toGetters(corner)
  const R = () => tx() - cx()

  const common = { fixed: true, highlight: false, visible }
  const elements: JXG.GeometryElement[] = []

  elements.push(board.create('circle', [[cx, cy], R], {
    ...common, layer: 4, strokeColor: color, strokeWidth: 1, strokeOpacity: 0.45, fillColor: 'none',
  }))
  elements.push(board.create('segment', [[tx, () => cy() - R() - 10], [tx, () => cy() + R() + 10]], {
    ...common, layer: 4, strokeColor: color, strokeWidth: 1, strokeOpacity: 0.6, dash: 2,
  }))

  if (options.showRise) {
    elements.push(board.create('segment', [[cx, cy], [tx, cy]], {
      ...common, layer: 4, strokeColor: color, strokeWidth: 1, strokeOpacity: 0.6, dash: 2,
    }))
    elements.push(board.create('segment', [[tx, cy], [tx, ty]], {
      ...common, layer: 6, strokeColor: color, strokeWidth: 2.5,
    }))
  }

  elements.push(board.create('text', [() => tx() - 5, () => (cy() + ty()) / 2, 'tan θ'], {
    ...common, visible: () => visible() && Math.abs(ty() - cy()) > 12,
    layer: 9, fontSize: 8, anchorX: 'right', anchorY: 'middle', strokeColor: color, parse: false,
    display: 'internal', cssDefaultStyle: FONT_CSS, cssStyle: 'pointer-events:none',
  }))

  return elements
}
