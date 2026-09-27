import JXG from 'jsxgraph'
import { getCorners } from './taperedQuad'
import { FONT_CSS, createAxisAttributes, createLabel } from './jsxgraphTheme'
import type { JsxPalette } from './jsxgraphTheme'

const BOARD_TITLE =
  'A whole tapered quad with the square-cut version shown as a ghost behind it. At each end a cut line through the end midpoint intersects the two shared side edges, giving the four corners. Sliders set the skew at the base and at the tip.'

const WIDTH_AT_BASE = 160
const WIDTH_AT_TIP = 100
const HEIGHT = 320
const Y_MIN = -HEIGHT / 2
const Y_MAX = HEIGHT / 2

type LabelAttributes = JXG.LabelOptions & { cssDefaultStyle: string }
type CornerKey = 'bottomLeft' | 'topLeft' | 'topRight' | 'bottomRight'

function formatNumber(value: number, digits: number) {
  return Number(value.toFixed(digits)).toString()
}

function labelAttributes(extra: JXG.LabelOptions): LabelAttributes {
  return { display: 'internal', cssDefaultStyle: FONT_CSS, highlight: false, ...extra }
}

function createPoint(board: JXG.Board, palette: JsxPalette, position: [number, number], extra?: JXG.PointAttributes) {
  return board.create('point', position, {
    fixed: true, size: 3, strokeColor: palette.ink, fillColor: palette.ink, highlight: false, showInfobox: false, withLabel: false, ...extra,
  })
}

function createSlider(board: JXG.Board, palette: JsxPalette, y: number, initial: number, name: string, color: string) {
  return board.create('slider', [[150, y], [280, y], [-45, initial, 45]], {
    name, snapWidth: 1, digits: 0, fillColor: color, strokeColor: color, highlight: false,
    baseline: { strokeColor: palette.secondaryInk, highlight: false }, highline: { strokeColor: color, highlight: false },
    ticks: { visible: false }, label: labelAttributes({ fontSize: 9, strokeColor: palette.ink }),
  })
}

function createSmallAxisAttributes(palette: JsxPalette): JXG.AxisAttributes {
  const axis = createAxisAttributes(palette)
  return { ...axis, ticks: { ...axis.ticks, label: { ...axis.ticks?.label, fontSize: 8 } } }
}

export function buildSkewTangentBoard(container: HTMLElement, palette: JsxPalette): JXG.Board {
  const attributes: Partial<JXG.BoardAttributes> & {
    infobox: Partial<JXG.InfoboxOptions>
    zoom: JXG.ZoomOptions & { enabled: boolean }
  } = {
    boundingbox: [-330, 250, 390, -310], axis: true, defaultAxes: { x: createSmallAxisAttributes(palette), y: createSmallAxisAttributes(palette) },
    keepaspectratio: true, showNavigation: false, showCopyright: false, showInfobox: false,
    pan: { enabled: false }, zoom: { enabled: false }, drag: { enabled: true }, resize: { enabled: true, throttle: 10 },
    infobox: { cssDefaultStyle: FONT_CSS, highlight: false },
    title: BOARD_TITLE,
  }
  const board = JXG.JSXGraph.initBoard(container, attributes)

  const skewAtBase = createSlider(board, palette, -250, 18, 'skewAtBase °', palette.baseCut)
  const skewAtTip = createSlider(board, palette, -285, 30, 'skewAtTip °', palette.tipCut)

  const square = getCorners(0, Y_MIN, HEIGHT, WIDTH_AT_BASE, WIDTH_AT_TIP, 0, 0)
  const corners = () => getCorners(0, Y_MIN, HEIGHT, WIDTH_AT_BASE, WIDTH_AT_TIP, skewAtBase.Value(), skewAtTip.Value())

  board.create('polygon', [square.bottomLeft, square.topLeft, square.topRight, square.bottomRight], {
    fillColor: palette.quad, fillOpacity: 0.12, highlight: false,
    borders: { strokeColor: palette.quad, dash: 2, strokeWidth: 1, highlight: false }, vertices: { visible: false },
  })
  const sideAttributes: JXG.LineAttributes = { strokeColor: palette.secondaryInk, strokeWidth: 1.5, highlight: false }
  const leftSide = board.create('line', [square.bottomLeft, square.topLeft], sideAttributes)
  const rightSide = board.create('line', [square.bottomRight, square.topRight], sideAttributes)

  const baseMidpoint = createPoint(board, palette, [0, Y_MIN], {
    size: 4, strokeColor: palette.baseCut, fillColor: palette.baseCut, name: 'base midpoint', withLabel: true,
    label: labelAttributes({ offset: [0, -12], anchorX: 'middle', fontSize: 8, strokeColor: palette.baseCut }),
  })
  const tipMidpoint = createPoint(board, palette, [0, Y_MAX], {
    size: 4, strokeColor: palette.tipCut, fillColor: palette.tipCut, name: 'tip midpoint', withLabel: true,
    label: labelAttributes({ offset: [-9, 16], anchorX: 'right', fontSize: 8, strokeColor: palette.tipCut }),
  })

  const baseCut = board.create('line', [baseMidpoint, () => [100, Y_MIN + 100 * corners().bottomTangent]], { strokeColor: palette.baseCut, strokeWidth: 1.5, highlight: false })
  const tipCut = board.create('line', [tipMidpoint, () => [100, Y_MAX + 100 * corners().topTangent]], { strokeColor: palette.tipCut, strokeWidth: 1.5, highlight: false })

  const endLineAttributes: JXG.SegmentAttributes = { strokeColor: palette.secondaryInk, dash: 2, strokeWidth: 1, highlight: false }
  board.create('segment', [[-140, Y_MIN], [140, Y_MIN]], endLineAttributes)
  board.create('segment', [[-110, Y_MAX], [110, Y_MAX]], endLineAttributes)

  const createCorner = (cut: JXG.Line, side: JXG.Line, name: string, color: string, offset: [number, number], anchorX: 'left' | 'right') =>
    board.create('intersection', [cut, side, 0], {
      size: 5, strokeColor: color, fillColor: color, highlight: false, showInfobox: false, name, withLabel: true,
      label: labelAttributes({ offset, anchorX, fontSize: 8, strokeColor: color }),
    })
  const bottomLeft = createCorner(baseCut, leftSide, '0 BL', palette.baseCut, [-6, -6], 'right')
  const bottomRight = createCorner(baseCut, rightSide, '3 BR', palette.baseCut, [6, -6], 'left')
  const topLeft = createCorner(tipCut, leftSide, '1 TL', palette.tipCut, [-6, 6], 'right')
  const topRight = createCorner(tipCut, rightSide, '2 TR', palette.tipCut, [6, 6], 'left')

  board.create('polygon', [bottomLeft, topLeft, topRight, bottomRight], {
    fillColor: palette.quad, fillOpacity: 0.7, highlight: false,
    borders: { strokeColor: palette.quad, strokeWidth: 1, highlight: false }, vertices: { visible: false },
  })

  for (const position of [square.bottomLeft, square.bottomRight]) createPoint(board, palette, position, { size: 4, strokeColor: palette.baseCut, fillColor: palette.panel, strokeWidth: 2 })
  for (const position of [square.topLeft, square.topRight]) createPoint(board, palette, position, { size: 4, strokeColor: palette.tipCut, fillColor: palette.panel, strokeWidth: 2 })

  const createLegs = (corner: JXG.Point, midpoint: JXG.Point, color: string) => {
    const legAttributes: JXG.SegmentAttributes = { strokeColor: color, strokeWidth: 2.5, highlight: false }
    board.create('segment', [midpoint, () => [corner.X(), midpoint.Y()]], legAttributes)
    board.create('segment', [() => [corner.X(), midpoint.Y()], corner], legAttributes)
  }
  createLegs(bottomLeft, baseMidpoint, palette.baseCut)
  createLegs(bottomRight, baseMidpoint, palette.baseCut)
  createLegs(topLeft, tipMidpoint, palette.tipCut)
  createLegs(topRight, tipMidpoint, palette.tipCut)

  const baseReference = createPoint(board, palette, [40, Y_MIN], { visible: false })
  const tipReference = createPoint(board, palette, [40, Y_MAX], { visible: false })
  const createSector = (parents: JXG.Point[], color: string, visible: () => boolean, degrees: () => number) =>
    board.create('angle', parents, {
      radius: 30, type: 'sector', fillColor: color, fillOpacity: 0.25, strokeColor: color, highlight: false,
      visible, name: () => formatNumber(degrees(), 0) + '°', label: labelAttributes({ fontSize: 8, strokeColor: color }),
    } as JXG.AngleAttributes)
  createSector([baseReference, baseMidpoint, bottomRight], palette.baseCut, () => corners().bottomTangent >= 0, () => skewAtBase.Value())
  createSector([bottomRight, baseMidpoint, baseReference], palette.baseCut, () => corners().bottomTangent < 0, () => -skewAtBase.Value())
  createSector([tipReference, tipMidpoint, topRight], palette.tipCut, () => corners().topTangent >= 0, () => skewAtTip.Value())
  createSector([topRight, tipMidpoint, tipReference], palette.tipCut, () => corners().topTangent < 0, () => -skewAtTip.Value())

  const X = 150
  const readout = (y: number, text: string | (() => string), color = palette.ink) =>
    createLabel(board, X, y, text, palette, { anchorX: 'left', fontSize: 8, strokeColor: color })
  readout(235, `widthAtBase ${WIDTH_AT_BASE}  widthAtTip ${WIDTH_AT_TIP}  height ${HEIGHT}`, palette.secondaryInk)
  readout(215, () => 'slope = (50 − 80) ÷ 320 = ' + formatNumber(corners().slope, 4))
  readout(195, () => 'tanBase = ' + formatNumber(corners().bottomTangent, 4) + '   tanTip = ' + formatNumber(corners().topTangent, 4))
  readout(165, 'corner   C# formula      JSX intersection', palette.secondaryInk)
  const cornerRow = (y: number, name: string, key: CornerKey, point: JXG.Point, color: string) =>
    readout(y, () => {
      const formula = corners()[key]
      return name + '  (' + formatNumber(formula[0], 1) + ', ' + formatNumber(formula[1], 1) + ')   (' + formatNumber(point.X(), 1) + ', ' + formatNumber(point.Y(), 1) + ')'
    }, color)
  cornerRow(145, '0 BL', 'bottomLeft', bottomLeft, palette.baseCut)
  cornerRow(125, '1 TL', 'topLeft', topLeft, palette.tipCut)
  cornerRow(105, '2 TR', 'topRight', topRight, palette.tipCut)
  cornerRow(85, '3 BR', 'bottomRight', bottomRight, palette.baseCut)
  readout(55, () => 'base: BR rises ' + formatNumber(bottomRight.Y() - Y_MIN, 1) + ', BL drops ' + formatNumber(Y_MIN - bottomLeft.Y(), 1), palette.baseCut)
  readout(35, () => 'tip:  TR rises ' + formatNumber(topRight.Y() - Y_MAX, 1) + ', TL drops ' + formatNumber(Y_MAX - topLeft.Y(), 1), palette.tipCut)

  return board
}
