import JXG from 'jsxgraph'

const inkColor = '#151312'
const secondaryInkColor = '#5a554f'
const quadColor = '#e3121b'
const gridColor = '#e6e1d8'

const FONT_CSS = 'font-family:"IBM Plex Mono",monospace;'

const degreeToRadian = Math.PI / 180

function skewTangent(skewDegrees: number, slope: number) {
  const tangent = Math.tan(skewDegrees * degreeToRadian)
  return Math.abs(slope * tangent) < 1 ? tangent : 0
}

function computeCorner(centerX: number, edgeY: number, signedHalfWidth: number, slope: number, tangent: number): [number, number] {
  const horizontalOffset = signedHalfWidth / (1 - slope * tangent)
  return [centerX + horizontalOffset, edgeY + horizontalOffset * tangent]
}

function getCorners(centerX: number, bottomY: number, height: number, bottomWidth: number, topWidth: number, bottomSkewDegrees: number, topSkewDegrees: number) {
  const bottomHalfWidth = bottomWidth * 0.5, topHalfWidth = topWidth * 0.5, slope = height > 0 ? (topHalfWidth - bottomHalfWidth) / height : 0
  const bottomTangent = skewTangent(bottomSkewDegrees, slope), topTangent = skewTangent(topSkewDegrees, slope), topY = bottomY + height
  return {
    slope, bottomTangent, topTangent, bottomHalfWidth, topHalfWidth, bottomY, topY,
    bottomLeft: computeCorner(centerX, bottomY, -bottomHalfWidth, -slope, bottomTangent), topLeft: computeCorner(centerX, topY, -topHalfWidth, -slope, topTangent),
    topRight: computeCorner(centerX, topY, topHalfWidth, slope, topTangent), bottomRight: computeCorner(centerX, bottomY, bottomHalfWidth, slope, bottomTangent),
  }
}

function createAxisAttributes(): JXG.AxisAttributes {
  const label: JXG.LabelOptions & { cssDefaultStyle: string } = {
    fontSize: 10, strokeColor: secondaryInkColor, display: 'internal', cssDefaultStyle: FONT_CSS, highlight: false,
  }
  return { strokeColor: gridColor, highlight: false, ticks: { strokeColor: gridColor, minorTicks: 1, majorHeight: 6, label } }
}

function createQuad(board: JXG.Board, getQuadCorners: () => ReturnType<typeof getCorners>) {
  return board.create('polygon', [() => getQuadCorners().bottomLeft, () => getQuadCorners().topLeft, () => getQuadCorners().topRight, () => getQuadCorners().bottomRight], {
    fillColor: quadColor, fillOpacity: 0.85, highlight: false,
    borders: { strokeColor: quadColor, strokeWidth: 1, highlight: false }, vertices: { visible: false },
  })
}

function createLabel(board: JXG.Board, positionX: number, positionY: number, labelText: string, extraAttributes?: JXG.TextAttributes) {
  return board.create('text', [positionX, positionY, labelText], {
    fontSize: 12, anchorX: 'middle', anchorY: 'middle', highlight: false, parse: false,
    strokeColor: inkColor, cssDefaultStyle: FONT_CSS, display: 'internal', ...extraAttributes,
  })
}

function createCornerMarker(board: JXG.Board, position: [number, number]) {
  return board.create('point', position, {
    fixed: true, size: 3, strokeColor: inkColor, fillColor: inkColor, highlight: false, showInfobox: false, withLabel: false,
  })
}

export function buildShapeIdeaBoard(container: HTMLElement): JXG.Board {
  const attributes: Partial<JXG.BoardAttributes> & {
    infobox: Partial<JXG.InfoboxOptions>
    zoom: JXG.ZoomOptions & { enabled: boolean }
  } = {
    boundingbox: [-160, 270, 560, -250], axis: true, defaultAxes: { x: createAxisAttributes(), y: createAxisAttributes() },
    keepaspectratio: true, showNavigation: false, showCopyright: false, showInfobox: false,
    pan: { enabled: false }, zoom: { enabled: false }, drag: { enabled: true }, resize: { enabled: true, throttle: 10 },
    infobox: { cssDefaultStyle: FONT_CSS, highlight: false },
    title:
      'Three shapes side by side: a plain rectangle, a tapered quad, and a tapered quad with skewed end cuts. All three have exactly four corners.',
  }
  const board = JXG.JSXGraph.initBoard(container, attributes)

  const rectangleCorners = () => getCorners(-40, -200, 400, 60, 60, 0, 0)
  const taperedCorners = () => getCorners(200, -200, 400, 60, 24, 0, 0)
  const skewedCorners = () => getCorners(440, -200, 400, 60, 24, 15, 35)
  createQuad(board, rectangleCorners)
  createQuad(board, taperedCorners)
  createQuad(board, skewedCorners)
  for (const cornerPosition of [skewedCorners().bottomLeft, skewedCorners().topLeft, skewedCorners().topRight, skewedCorners().bottomRight]) createCornerMarker(board, cornerPosition)
  createLabel(board, -40, -230, 'Image (default)')
  createLabel(board, 200, -230, '+ taper')
  createLabel(board, 440, -230, '+ skew at both ends')
  createLabel(board, -40, 235, '60 → 60', { strokeColor: secondaryInkColor })
  createLabel(board, 200, 235, '60 → 24', { strokeColor: secondaryInkColor })
  createLabel(board, 440, 250, 'cuts 15° / 35°', { strokeColor: secondaryInkColor })

  return board
}
