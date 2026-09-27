import JXG from 'jsxgraph'
import { getCorners } from './taperedQuad'
import { FONT_CSS, createAxisAttributes, createCornerMarker, createLabel, createQuad } from './jsxgraphTheme'
import type { JsxPalette } from './jsxgraphTheme'

export function buildShapeIdeaBoard(container: HTMLElement, palette: JsxPalette): JXG.Board {
  const attributes: Partial<JXG.BoardAttributes> & {
    infobox: Partial<JXG.InfoboxOptions>
    zoom: JXG.ZoomOptions & { enabled: boolean }
  } = {
    boundingbox: [-160, 270, 560, -250], axis: true, defaultAxes: { x: createAxisAttributes(palette), y: createAxisAttributes(palette) },
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
  createQuad(board, rectangleCorners, palette)
  createQuad(board, taperedCorners, palette)
  createQuad(board, skewedCorners, palette)
  for (const cornerPosition of [skewedCorners().bottomLeft, skewedCorners().topLeft, skewedCorners().topRight, skewedCorners().bottomRight]) createCornerMarker(board, cornerPosition, palette)
  createLabel(board, -40, -230, 'Image (default)', palette)
  createLabel(board, 200, -230, '+ taper', palette)
  createLabel(board, 440, -230, '+ skew at both ends', palette)
  createLabel(board, -40, 235, '60 → 60', palette, { strokeColor: palette.secondaryInk })
  createLabel(board, 200, 235, '60 → 24', palette, { strokeColor: palette.secondaryInk })
  createLabel(board, 440, 250, 'cuts 15° / 35°', palette, { strokeColor: palette.secondaryInk })

  return board
}
