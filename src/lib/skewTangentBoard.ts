import JXG from 'jsxgraph'
import { getCorners } from './taperedQuad'
import { FONT_CSS, createAxisAttributes, createLabel, inkColor, quadColor, secondaryInkColor } from './jsxgraphTheme'
import { baseCutColor, tipCutColor } from './geometryVisualizationBoard'

const panelColor = '#ffffff'

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

function createPoint(board: JXG.Board, position: [number, number], extra?: JXG.PointAttributes) {
  return board.create('point', position, {
    fixed: true, size: 3, strokeColor: inkColor, fillColor: inkColor, highlight: false, showInfobox: false, withLabel: false, ...extra,
  })
}

function createSlider(board: JXG.Board, y: number, initial: number, name: string, color: string) {
  return board.create('slider', [[150, y], [330, y], [-45, initial, 45]], {
    name, snapWidth: 1, digits: 0, fillColor: color, strokeColor: color, highlight: false,
    baseline: { strokeColor: secondaryInkColor, highlight: false }, highline: { strokeColor: color, highlight: false },
    ticks: { visible: false }, label: labelAttributes({ fontSize: 12, strokeColor: inkColor }),
  })
}

export function buildSkewTangentBoard(container: HTMLElement): JXG.Board {
  const attributes: Partial<JXG.BoardAttributes> & {
    infobox: Partial<JXG.InfoboxOptions>
    zoom: JXG.ZoomOptions & { enabled: boolean }
  } = {
    boundingbox: [-330, 250, 390, -310], axis: true, defaultAxes: { x: createAxisAttributes(), y: createAxisAttributes() },
    keepaspectratio: true, showNavigation: false, showCopyright: false, showInfobox: false,
    pan: { enabled: false }, zoom: { enabled: false }, drag: { enabled: true }, resize: { enabled: true, throttle: 10 },
    infobox: { cssDefaultStyle: FONT_CSS, highlight: false },
    title: BOARD_TITLE,
  }
  const board = JXG.JSXGraph.initBoard(container, attributes)

  const skewAtBase = createSlider(board, -250, 18, 'skewAtBase °', baseCutColor)
  const skewAtTip = createSlider(board, -285, 30, 'skewAtTip °', tipCutColor)

  const square = getCorners(0, Y_MIN, HEIGHT, WIDTH_AT_BASE, WIDTH_AT_TIP, 0, 0)
  const corners = () => getCorners(0, Y_MIN, HEIGHT, WIDTH_AT_BASE, WIDTH_AT_TIP, skewAtBase.Value(), skewAtTip.Value())

  board.create('polygon', [square.bottomLeft, square.topLeft, square.topRight, square.bottomRight], {
    fillColor: quadColor, fillOpacity: 0.12, highlight: false,
    borders: { strokeColor: quadColor, dash: 2, strokeWidth: 1, highlight: false }, vertices: { visible: false },
  })
  const sideAttributes: JXG.LineAttributes = { strokeColor: secondaryInkColor, strokeWidth: 1.5, highlight: false }
  const leftSide = board.create('line', [square.bottomLeft, square.topLeft], sideAttributes)
  const rightSide = board.create('line', [square.bottomRight, square.topRight], sideAttributes)

  const baseMidpoint = createPoint(board, [0, Y_MIN], {
    size: 4, strokeColor: baseCutColor, fillColor: baseCutColor, name: 'base midpoint', withLabel: true,
    label: labelAttributes({ offset: [0, -16], anchorX: 'middle', fontSize: 11, strokeColor: baseCutColor }),
  })
  const tipMidpoint = createPoint(board, [0, Y_MAX], {
    size: 4, strokeColor: tipCutColor, fillColor: tipCutColor, name: 'tip midpoint', withLabel: true,
    label: labelAttributes({ offset: [-12, 22], anchorX: 'right', fontSize: 11, strokeColor: tipCutColor }),
  })

  const baseCut = board.create('line', [baseMidpoint, () => [100, Y_MIN + 100 * corners().bottomTangent]], { strokeColor: baseCutColor, strokeWidth: 1.5, highlight: false })
  const tipCut = board.create('line', [tipMidpoint, () => [100, Y_MAX + 100 * corners().topTangent]], { strokeColor: tipCutColor, strokeWidth: 1.5, highlight: false })

  const endLineAttributes: JXG.SegmentAttributes = { strokeColor: secondaryInkColor, dash: 2, strokeWidth: 1, highlight: false }
  board.create('segment', [[-140, Y_MIN], [140, Y_MIN]], endLineAttributes)
  board.create('segment', [[-110, Y_MAX], [110, Y_MAX]], endLineAttributes)

  const createCorner = (cut: JXG.Line, side: JXG.Line, name: string, color: string, offset: [number, number], anchorX: 'left' | 'right') =>
    board.create('intersection', [cut, side, 0], {
      size: 5, strokeColor: color, fillColor: color, highlight: false, showInfobox: false, name, withLabel: true,
      label: labelAttributes({ offset, anchorX, fontSize: 11, strokeColor: color }),
    })
  const bottomLeft = createCorner(baseCut, leftSide, '0 BL', baseCutColor, [-8, -8], 'right')
  const bottomRight = createCorner(baseCut, rightSide, '3 BR', baseCutColor, [8, -8], 'left')
  const topLeft = createCorner(tipCut, leftSide, '1 TL', tipCutColor, [-8, 8], 'right')
  const topRight = createCorner(tipCut, rightSide, '2 TR', tipCutColor, [8, 8], 'left')

  board.create('polygon', [bottomLeft, topLeft, topRight, bottomRight], {
    fillColor: quadColor, fillOpacity: 0.7, highlight: false,
    borders: { strokeColor: quadColor, strokeWidth: 1, highlight: false }, vertices: { visible: false },
  })

  for (const position of [square.bottomLeft, square.bottomRight]) createPoint(board, position, { size: 4, strokeColor: baseCutColor, fillColor: panelColor, strokeWidth: 2 })
  for (const position of [square.topLeft, square.topRight]) createPoint(board, position, { size: 4, strokeColor: tipCutColor, fillColor: panelColor, strokeWidth: 2 })

  const createLegs = (corner: JXG.Point, midpoint: JXG.Point, color: string) => {
    const legAttributes: JXG.SegmentAttributes = { strokeColor: color, strokeWidth: 2.5, highlight: false }
    board.create('segment', [midpoint, () => [corner.X(), midpoint.Y()]], legAttributes)
    board.create('segment', [() => [corner.X(), midpoint.Y()], corner], legAttributes)
  }
  createLegs(bottomLeft, baseMidpoint, baseCutColor)
  createLegs(bottomRight, baseMidpoint, baseCutColor)
  createLegs(topLeft, tipMidpoint, tipCutColor)
  createLegs(topRight, tipMidpoint, tipCutColor)

  const baseReference = createPoint(board, [40, Y_MIN], { visible: false })
  const tipReference = createPoint(board, [40, Y_MAX], { visible: false })
  const createSector = (parents: JXG.Point[], color: string, visible: () => boolean, degrees: () => number) =>
    board.create('angle', parents, {
      radius: 30, type: 'sector', fillColor: color, fillOpacity: 0.25, strokeColor: color, highlight: false,
      visible, name: () => formatNumber(degrees(), 0) + '°', label: labelAttributes({ fontSize: 11, strokeColor: color }),
    } as JXG.AngleAttributes)
  createSector([baseReference, baseMidpoint, bottomRight], baseCutColor, () => corners().bottomTangent >= 0, () => skewAtBase.Value())
  createSector([bottomRight, baseMidpoint, baseReference], baseCutColor, () => corners().bottomTangent < 0, () => -skewAtBase.Value())
  createSector([tipReference, tipMidpoint, topRight], tipCutColor, () => corners().topTangent >= 0, () => skewAtTip.Value())
  createSector([topRight, tipMidpoint, tipReference], tipCutColor, () => corners().topTangent < 0, () => -skewAtTip.Value())

  const X = 150
  const readout = (y: number, text: string | (() => string), color = inkColor) =>
    createLabel(board, X, y, text, { anchorX: 'left', fontSize: 11, strokeColor: color })
  readout(235, `widthAtBase ${WIDTH_AT_BASE}  widthAtTip ${WIDTH_AT_TIP}  height ${HEIGHT}`, secondaryInkColor)
  readout(215, () => 'slope = (50 − 80) ÷ 320 = ' + formatNumber(corners().slope, 4))
  readout(195, () => 'tanBase = ' + formatNumber(corners().bottomTangent, 4) + '   tanTip = ' + formatNumber(corners().topTangent, 4))
  readout(165, 'corner   C# formula      JSX intersection', secondaryInkColor)
  const cornerRow = (y: number, name: string, key: CornerKey, point: JXG.Point, color: string) =>
    readout(y, () => {
      const formula = corners()[key]
      return name + '  (' + formatNumber(formula[0], 1) + ', ' + formatNumber(formula[1], 1) + ')   (' + formatNumber(point.X(), 1) + ', ' + formatNumber(point.Y(), 1) + ')'
    }, color)
  cornerRow(145, '0 BL', 'bottomLeft', bottomLeft, baseCutColor)
  cornerRow(125, '1 TL', 'topLeft', topLeft, tipCutColor)
  cornerRow(105, '2 TR', 'topRight', topRight, tipCutColor)
  cornerRow(85, '3 BR', 'bottomRight', bottomRight, baseCutColor)
  readout(55, () => 'base: BR rises ' + formatNumber(bottomRight.Y() - Y_MIN, 1) + ', BL drops ' + formatNumber(Y_MIN - bottomLeft.Y(), 1), baseCutColor)
  readout(35, () => 'tip:  TR rises ' + formatNumber(topRight.Y() - Y_MAX, 1) + ', TL drops ' + formatNumber(Y_MAX - topLeft.Y(), 1), tipCutColor)

  return board
}
