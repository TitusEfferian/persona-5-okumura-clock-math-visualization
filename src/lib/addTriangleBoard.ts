import JXG from 'jsxgraph'
import { getCorners } from './taperedQuad'
import { FONT_CSS, createLabel } from './jsxgraphTheme'
import type { JsxPalette } from './jsxgraphTheme'

const BOARD_TITLE =
  'The quad split into two triangles: triangle A (vertices 0,1,2) and triangle B (vertices 2,3,0), sharing the diagonal from 0 to 2. Corners can be dragged.'
const RECT_WIDTH = 240
const RECT_HEIGHT = 300

export function buildAddTriangleBoard(container: HTMLElement, palette: JsxPalette): JXG.Board {
  const attributes: Partial<JXG.BoardAttributes> & {
    infobox: Partial<JXG.InfoboxOptions>
    zoom: JXG.ZoomOptions & { enabled: boolean }
  } = {
    boundingbox: [-170, 200, 170, -200], axis: false,
    keepaspectratio: true, showNavigation: false, showCopyright: false, showInfobox: false,
    pan: { enabled: false }, zoom: { enabled: false }, drag: { enabled: true }, resize: { enabled: true, throttle: 10 },
    infobox: { cssDefaultStyle: FONT_CSS, highlight: false },
    title: BOARD_TITLE,
  }
  const board = JXG.JSXGraph.initBoard(container, attributes)

  // normal rectangle shape
  const c = getCorners(0, -RECT_HEIGHT / 2, RECT_HEIGHT, RECT_WIDTH, RECT_WIDTH, 0, 0)
  const cornerPositions: [number, number][] = [c.bottomLeft, c.topLeft, c.topRight, c.bottomRight]
  const cornerNames = ['0 BL', '1 TL', '2 TR', '3 BR']
  const labelOffsets: [number, number][] = [[-8, -4], [-8, 6], [8, 6], [8, -4]]
  const points = cornerPositions.map((position, i) =>
    board.create('point', position, {
      name: cornerNames[i], size: 5, strokeColor: palette.ink, fillColor: palette.ink, highlight: false, showInfobox: false, withLabel: true,
      label: {
        offset: labelOffsets[i], anchorX: i < 2 ? 'right' : 'left', fontSize: 12, strokeColor: palette.ink,
        cssDefaultStyle: FONT_CSS, display: 'internal', highlight: false,
      },
    }),
  )
  const [p0, p1, p2, p3] = points

  const triangleAttributes = { fillOpacity: 0.45, highlight: false, hasInnerPoints: false, borders: { strokeColor: palette.ink, strokeWidth: 1.5, highlight: false } }
  board.create('polygon', [p0, p1, p2], { ...triangleAttributes, fillColor: palette.tipCut })
  board.create('polygon', [p2, p3, p0], { ...triangleAttributes, fillColor: palette.baseCut })
  board.create('segment', [p0, p2], { strokeColor: palette.ink, dash: 3, strokeWidth: 2, highlight: false, fixed: true })

  createLabel(board, -45, 40, 'tri A  0·1·2', palette, { strokeColor: palette.tipCut })
  createLabel(board, 45, -40, 'tri B  2·3·0', palette, { strokeColor: palette.baseCut })
  const hintAttributes = { strokeColor: palette.secondaryInk, fontSize: 10 }
  createLabel(board, 0, -178, 'vertex at every corner dragable to understand', palette, hintAttributes)
  createLabel(board, 0, -190, 'the visualization of addVert + addTriangle', palette, hintAttributes)

  return board
}
