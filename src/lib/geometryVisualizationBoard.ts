import JXG from 'jsxgraph'
import { getCorners } from './taperedQuad'
import { FONT_CSS, createAxisAttributes, createQuad } from './jsxgraphTheme'
import type { JsxPalette } from './jsxgraphTheme'

export type QuadParams = {
  widthAtBase: number
  widthAtTip: number
  skewAtBase: number
  skewAtTip: number
  height: number
}

export type ShowFlags = {
  triangles: boolean
  lines: boolean
  rect: boolean
}

export type LiveState = {
  params: QuadParams
  show: ShowFlags
}

export type PresetName = 'clockhand' | 'random' | 'plate' | 'rectangle'

export const PRESETS: Record<PresetName, QuadParams> = {
  clockhand: { widthAtBase: 61, widthAtTip: 20.4, skewAtBase: 11, skewAtTip: 41.3, height: 464.4 },
  random: { widthAtBase: 48, widthAtTip: 32, skewAtBase: 0, skewAtTip: 0, height: 380 },
  plate: { widthAtBase: 80, widthAtTip: 52, skewAtBase: 0, skewAtTip: 0, height: 373.6 },
  rectangle: { widthAtBase: 60, widthAtTip: 60, skewAtBase: 0, skewAtTip: 0, height: 380 },
}

export const PRESET_LABELS: Record<PresetName, string> = {
  clockhand: 'ClockHand (thin)',
  random: 'RandomClockHand (thick)',
  plate: 'BlackFix (plate)',
  rectangle: 'normal rectangle',
}

export const PRESET_NAMES: PresetName[] = ['clockhand', 'random', 'plate', 'rectangle']

export type SliderSpec = { key: keyof QuadParams; label: string; min: number; max: number; step: number }

export const SLIDERS: SliderSpec[] = [
  { key: 'widthAtBase', label: 'widthAtBase', min: 0, max: 160, step: 0.5 },
  { key: 'widthAtTip', label: 'widthAtTip', min: 0, max: 160, step: 0.5 },
  { key: 'skewAtBase', label: 'skewAtBase °', min: -45, max: 45, step: 0.5 },
  { key: 'skewAtTip', label: 'skewAtTip °', min: -45, max: 45, step: 0.5 },
  { key: 'height', label: 'height', min: 40, max: 500, step: 0.5 },
]

export const DEFAULT_SHOW: ShowFlags = { triangles: true, lines: true, rect: true }

export function snapToStep(value: number, step: number) {
  return Math.round(value / step) * step
}

export function snapPreset(preset: QuadParams): QuadParams {
  const snapped = { ...preset }
  for (const slider of SLIDERS) snapped[slider.key] = snapToStep(preset[slider.key], slider.step)
  return snapped
}

function formatNumber(value: number, digits = 3) {
  return Number(value.toFixed(digits)).toString()
}

function cornersOf(params: QuadParams) {
  return getCorners(0, -params.height / 2, params.height, params.widthAtBase, params.widthAtTip, params.skewAtBase, params.skewAtTip)
}

function syncedRectWidth(corners: ReturnType<typeof cornersOf>) {
  return 2 * Math.max(Math.abs(corners.bottomLeft[0]), Math.abs(corners.topLeft[0]), Math.abs(corners.topRight[0]), Math.abs(corners.bottomRight[0]))
}

export function computeReadout(params: QuadParams) {
  const corners = cornersOf(params), width = syncedRectWidth(corners)
  const text =
    `halfBase ${formatNumber(corners.bottomHalfWidth)}   halfTip ${formatNumber(corners.topHalfWidth)}
slope    ${formatNumber(corners.slope, 5)}
tanBase  ${formatNumber(corners.bottomTangent, 5)}${corners.bottomTangent === 0 && params.skewAtBase !== 0 ? '  (guard: square)' : ''}
tanTip   ${formatNumber(corners.topTangent, 5)}${corners.topTangent === 0 && params.skewAtTip !== 0 ? '  (guard: square)' : ''}
BL (${formatNumber(corners.bottomLeft[0])}, ${formatNumber(corners.bottomLeft[1])})
TL (${formatNumber(corners.topLeft[0])}, ${formatNumber(corners.topLeft[1])})
TR (${formatNumber(corners.topRight[0])}, ${formatNumber(corners.topRight[1])})
BR (${formatNumber(corners.bottomRight[0])}, ${formatNumber(corners.bottomRight[1])})
synced rect width ${formatNumber(width)}`
  return { text, corners, syncedRectWidth: width }
}

export function buildGeometryVisualizationBoard(container: HTMLElement, live: LiveState, palette: JsxPalette): JXG.Board {
  const attributes: Partial<JXG.BoardAttributes> & {
    infobox: Partial<JXG.InfoboxOptions>
    zoom: JXG.ZoomOptions & { enabled: boolean }
  } = {
    boundingbox: [-170, 290, 170, -290], axis: true, defaultAxes: { x: createAxisAttributes(palette), y: createAxisAttributes(palette) },
    keepaspectratio: true, showNavigation: false, showCopyright: false, showInfobox: false,
    pan: { enabled: false }, zoom: { enabled: false }, drag: { enabled: true }, resize: { enabled: true, throttle: 10 },
    infobox: { cssDefaultStyle: FONT_CSS, highlight: false },
    title: 'Interactive JSXGraph drawing of the tapered quad produced by the current slider values',
  }
  const board = JXG.JSXGraph.initBoard(container, attributes)

  const corners = () => cornersOf(live.params)
  const width = () => syncedRectWidth(corners())
  const showRect = () => live.show.rect
  const showLines = () => live.show.lines
  const showTriangles = () => live.show.triangles

  board.create('polygon', [
    () => [-width() / 2, corners().bottomY], () => [-width() / 2, corners().topY], () => [width() / 2, corners().topY], () => [width() / 2, corners().bottomY],
  ], {
    fillOpacity: 0, highlight: false, visible: showRect,
    borders: { strokeColor: palette.secondaryInk, dash: 2, strokeWidth: 1, highlight: false, layer: 8 }, vertices: { visible: false },
  })
  board.create('line', [() => corners().bottomLeft, () => corners().topLeft], { strokeColor: palette.secondaryInk, strokeWidth: 1, strokeOpacity: 0.6, highlight: false, visible: showLines })
  board.create('line', [() => corners().bottomRight, () => corners().topRight], { strokeColor: palette.secondaryInk, strokeWidth: 1, strokeOpacity: 0.6, highlight: false, visible: showLines })
  board.create('line', [() => [0, corners().bottomY], () => [100, corners().bottomY + 100 * corners().bottomTangent]], { strokeColor: palette.baseCut, strokeWidth: 1.5, highlight: false, visible: showLines })
  board.create('line', [() => [0, corners().topY], () => [100, corners().topY + 100 * corners().topTangent]], { strokeColor: palette.tipCut, strokeWidth: 1.5, highlight: false, visible: showLines })
  createQuad(board, corners, palette)
  board.create('segment', [() => corners().bottomLeft, () => corners().topRight], { strokeColor: palette.panel, dash: 3, strokeWidth: 1.5, highlight: false, visible: showTriangles })

  const midpointAttributes = { fixed: true, size: 3, highlight: false, showInfobox: false, withLabel: false, visible: showLines }
  board.create('point', [() => 0, () => corners().bottomY], { ...midpointAttributes, strokeColor: palette.baseCut, fillColor: palette.baseCut })
  board.create('point', [() => 0, () => corners().topY], { ...midpointAttributes, strokeColor: palette.tipCut, fillColor: palette.tipCut })

  const cornerLabels: { name: string; corner: () => [number, number]; offset: [number, number]; anchorX: 'left' | 'right' }[] = [
    { name: '0 BL', corner: () => corners().bottomLeft, offset: [-6, -10], anchorX: 'right' },
    { name: '1 TL', corner: () => corners().topLeft, offset: [-6, 8], anchorX: 'right' },
    { name: '2 TR', corner: () => corners().topRight, offset: [6, 8], anchorX: 'left' },
    { name: '3 BR', corner: () => corners().bottomRight, offset: [6, -10], anchorX: 'left' },
  ]
  for (const cornerLabel of cornerLabels) {
    board.create('point', [() => cornerLabel.corner()[0], () => cornerLabel.corner()[1]], {
      fixed: true, size: 3.5, strokeColor: palette.ink, fillColor: palette.ink, highlight: false, showInfobox: false,
      name: cornerLabel.name, withLabel: true,
      label: {
        offset: cornerLabel.offset, anchorX: cornerLabel.anchorX, fontSize: 11,
        strokeColor: palette.ink, cssDefaultStyle: FONT_CSS, display: 'internal', highlight: false,
      },
    })
  }

  return board
}
