import JXG from 'jsxgraph'
import { getCorners } from './taperedQuad'
import { FONT_CSS, createLabel, inkColor, secondaryInkColor } from './jsxgraphTheme'
import { baseCutColor, tipCutColor } from './geometryVisualizationBoard'

const BOARD_TITLE =
  'The quad split into two triangles: vertices 0,1,2 in blue and 2,3,0 in gold, sharing the diagonal from 0 to 2. Corners can be dragged.'

export function buildAddTriangleBoard(container: HTMLElement): JXG.Board {
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

  const c = getCorners(0, -150, 300, 200, 120, 12, 28)
  const cornerPositions: [number, number][] = [c.bottomLeft, c.topLeft, c.topRight, c.bottomRight]
  const cornerNames = ['0 BL', '1 TL', '2 TR', '3 BR']
  const labelOffsets: [number, number][] = [[-8, -4], [-8, 6], [8, 6], [8, -4]]
  const points = cornerPositions.map((position, i) =>
    board.create('point', position, {
      name: cornerNames[i], size: 5, strokeColor: inkColor, fillColor: inkColor, highlight: false, showInfobox: false, withLabel: true,
      label: {
        offset: labelOffsets[i], anchorX: i < 2 ? 'right' : 'left', fontSize: 12, strokeColor: inkColor,
        cssDefaultStyle: FONT_CSS, display: 'internal', highlight: false,
      },
    }),
  )
  const [p0, p1, p2, p3] = points

  const triangleAttributes = { fillOpacity: 0.35, highlight: false, hasInnerPoints: false, borders: { strokeColor: inkColor, strokeWidth: 1.5, highlight: false } }
  board.create('polygon', [p0, p1, p2], { ...triangleAttributes, fillColor: tipCutColor })
  board.create('polygon', [p2, p3, p0], { ...triangleAttributes, fillColor: baseCutColor })
  board.create('segment', [p0, p2], { strokeColor: inkColor, dash: 3, strokeWidth: 2, highlight: false, fixed: true })

  createLabel(board, -45, 40, 'tri A  0·1·2', { strokeColor: tipCutColor })
  createLabel(board, 45, -40, 'tri B  2·3·0', { strokeColor: baseCutColor })
  createLabel(board, 0, -185, 'drag any corner', { strokeColor: secondaryInkColor, fontSize: 11 })

  return board
}
