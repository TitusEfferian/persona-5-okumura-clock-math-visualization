import JXG from 'jsxgraph'

const INK = '#151312'
const INK2 = '#5a554f'
const RED = '#e3121b'
const GRID = '#e6e1d8'

const FONT_CSS = 'font-family:"IBM Plex Mono",monospace;'

const D2R = Math.PI / 180

function skewTangent(skew: number, slope: number) {
  const t = Math.tan(skew * D2R)
  return Math.abs(slope * t) < 1 ? t : 0
}

function corner(cx: number, y: number, hw: number, slope: number, t: number): [number, number] {
  const dx = hw / (1 - slope * t)
  return [cx + dx, y + dx * t]
}

function getCorners(cx: number, yMin: number, h: number, wb: number, wt: number, sb: number, st: number) {
  const hb = wb * 0.5, ht = wt * 0.5, slope = h > 0 ? (ht - hb) / h : 0
  const tb = skewTangent(sb, slope), tt = skewTangent(st, slope), yMax = yMin + h
  return {
    slope, tb, tt, hb, ht, yMin, yMax,
    bl: corner(cx, yMin, -hb, -slope, tb), tl: corner(cx, yMax, -ht, -slope, tt),
    tr: corner(cx, yMax, ht, slope, tt), br: corner(cx, yMin, hb, slope, tb),
  }
}

function axis(): JXG.AxisAttributes {
  const label: JXG.LabelOptions & { cssDefaultStyle: string } = {
    fontSize: 10, strokeColor: INK2, display: 'internal', cssDefaultStyle: FONT_CSS, highlight: false,
  }
  return { strokeColor: GRID, highlight: false, ticks: { strokeColor: GRID, minorTicks: 1, majorHeight: 6, label } }
}

function quad(board: JXG.Board, c: () => ReturnType<typeof getCorners>) {
  return board.create('polygon', [() => c().bl, () => c().tl, () => c().tr, () => c().br], {
    fillColor: RED, fillOpacity: 0.85, highlight: false,
    borders: { strokeColor: RED, strokeWidth: 1, highlight: false }, vertices: { visible: false },
  })
}

function txt(board: JXG.Board, x: number, y: number, s: string, attrs?: JXG.TextAttributes) {
  return board.create('text', [x, y, s], {
    fontSize: 12, anchorX: 'middle', anchorY: 'middle', highlight: false, parse: false,
    strokeColor: INK, cssDefaultStyle: FONT_CSS, display: 'internal', ...attrs,
  })
}

function pt(board: JXG.Board, xy: [number, number]) {
  return board.create('point', xy, {
    fixed: true, size: 3, strokeColor: INK, fillColor: INK, highlight: false, showInfobox: false, withLabel: false,
  })
}

export function buildShapeIdeaBoard(container: HTMLElement): JXG.Board {
  const attributes: Partial<JXG.BoardAttributes> & {
    infobox: Partial<JXG.InfoboxOptions>
    zoom: JXG.ZoomOptions & { enabled: boolean }
  } = {
    boundingbox: [-160, 270, 560, -250], axis: true, defaultAxes: { x: axis(), y: axis() },
    keepaspectratio: true, showNavigation: false, showCopyright: false, showInfobox: false,
    pan: { enabled: false }, zoom: { enabled: false }, drag: { enabled: true }, resize: { enabled: true, throttle: 10 },
    infobox: { cssDefaultStyle: FONT_CSS, highlight: false },
    title:
      'Three shapes side by side: a plain rectangle, a tapered quad, and a tapered quad with skewed end cuts. All three have exactly four corners.',
  }
  const b = JXG.JSXGraph.initBoard(container, attributes)

  const A = () => getCorners(-40, -200, 400, 60, 60, 0, 0)
  const B = () => getCorners(200, -200, 400, 60, 24, 0, 0)
  const C = () => getCorners(440, -200, 400, 60, 24, 15, 35)
  quad(b, A)
  quad(b, B)
  quad(b, C)
  for (const p of [C().bl, C().tl, C().tr, C().br]) pt(b, p)
  txt(b, -40, -230, 'Image (default)')
  txt(b, 200, -230, '+ taper')
  txt(b, 440, -230, '+ skew at both ends')
  txt(b, -40, 235, '60 → 60', { strokeColor: INK2 })
  txt(b, 200, 235, '60 → 24', { strokeColor: INK2 })
  txt(b, 440, 250, 'cuts 15° / 35°', { strokeColor: INK2 })

  return b
}
