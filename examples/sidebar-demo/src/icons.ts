import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

type PathDef = Readonly<{ d: string }>
type CircleDef = Readonly<{ cx: string; cy: string; r: string }>
type RectDef = Readonly<{
  width: string
  height: string
  x: string
  y: string
}>
type PolylineDef = Readonly<{ points: string }>
type LineDef = Readonly<{ x1: string; y1: string; x2: string; y2: string }>

type IconChild = PathDef | CircleDef | RectDef | PolylineDef | LineDef

const strokeAttrs = () => {
  const h = html()

  return [h.StrokeLinecap('round'), h.StrokeLinejoin('round')] as const
}

const lucideIcon = (children: ReadonlyArray<IconChild>, size = '16'): Html => {
  const h = html()
  const [linecap, linejoin] = strokeAttrs()

  const svgChildren = children.map(child => {
    if ('d' in child) {
      return h.path([linecap, linejoin, h.D(child.d)], [])
    }

    if ('points' in child) {
      return h.polyline([linecap, linejoin, h.Points(child.points)], [])
    }

    if ('cx' in child) {
      return h.circle([linecap, linejoin, h.Cx(child.cx), h.Cy(child.cy), h.R(child.r)], [])
    }

    if ('x1' in child) {
      return h.line(
        [linecap, linejoin, h.X1(child.x1), h.Y1(child.y1), h.X2(child.x2), h.Y2(child.y2)],
        [],
      )
    }

    return h.rect(
      [linecap, linejoin, h.Width(child.width), h.Height(child.height), h.X(child.x), h.Y(child.y)],
      [],
    )
  })

  return h.svg(
    [
      h.AriaHidden(true),
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.Width(size),
      h.Height(size),
    ],
    svgChildren,
  )
}

export const galleryVerticalEndIcon = lucideIcon([
  { width: '7', height: '9', x: '3', y: '3' },
  { width: '7', height: '5', x: '14', y: '3' },
  { width: '7', height: '9', x: '14', y: '12' },
  { width: '7', height: '5', x: '3', y: '16' },
])

export const squareTerminalIcon = lucideIcon([
  { width: '18', height: '18', x: '3', y: '3' },
  { d: 'M7 8h10' },
  { d: 'M7 12h10' },
  { d: 'M7 16h6' },
])

export const botIcon = lucideIcon([
  { width: '18', height: '10', x: '3', y: '11' },
  { d: 'M12 2v4' },
  { d: 'M8 11V7a4 4 0 0 1 8 0v4' },
  { cx: '8', cy: '16', r: '1' },
  { cx: '16', cy: '16', r: '1' },
])

export const bookOpenIcon = lucideIcon([
  { d: 'M12 7v14' },
  {
    d: 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
  },
])

export const settings2Icon = lucideIcon([
  { d: 'M14 17H5' },
  { d: 'M19 7h-9' },
  { cx: '17', cy: '17', r: '3' },
  { cx: '7', cy: '7', r: '3' },
])

export const frameIcon = lucideIcon([
  { width: '18', height: '18', x: '3', y: '3' },
  { d: 'M3 9h18' },
  { d: 'M9 21V9' },
])

export const pieChartIcon = lucideIcon([
  { d: 'M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z' },
  { d: 'M21.21 15.89A10 10 0 1 1 8 2.83' },
])

export const mapIcon = lucideIcon([
  { d: 'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z' },
  { d: 'M15 5.764v15' },
  { d: 'M9 3.236v15' },
])

export const moreHorizontalIcon = lucideIcon([
  { cx: '12', cy: '12', r: '1' },
  { cx: '19', cy: '12', r: '1' },
  { cx: '5', cy: '12', r: '1' },
])

export const chevronRightIcon = lucideIcon([{ d: 'm9 18 6-6-6-6' }])

export const chevronsUpDownIcon = lucideIcon([
  { d: 'm7 15 5 5 5-5' },
  { d: 'm7 9 5-5 5 5' },
])

export const panelLeftIcon = lucideIcon([
  { width: '18', height: '18', x: '3', y: '3' },
  { d: 'M9 3v18' },
])

export const xMarkIcon = lucideIcon([
  { d: 'M18 6 6 18' },
  { d: 'm6 6 12 12' },
])

export const plusIcon = lucideIcon([
  { d: 'M5 12h14' },
  { d: 'M12 5v14' },
])

export const folderIcon = lucideIcon([
  { d: 'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z' },
])

export const forwardIcon = lucideIcon([
  { d: 'm9 18 6-6-6-6' },
  { d: 'M3 12h12' },
])

export const trash2Icon = lucideIcon([
  { d: 'M3 6h18' },
  { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' },
  { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' },
  { d: 'M10 11v6' },
  { d: 'M14 11v6' },
])

export const sparklesIcon = lucideIcon([{ d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' }])

export const badgeCheckIcon = lucideIcon([
  { d: 'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z' },
  { d: 'm9 12 2 2 4-4' },
])

export const creditCardIcon = lucideIcon([
  { width: '20', height: '14', x: '2', y: '5' },
  { d: 'M2 10h20' },
])

export const bellIcon = lucideIcon([
  { d: 'M10.268 21a2 2 0 0 0 3.464 0' },
  { d: 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326' },
])

export const logOutIcon = lucideIcon([
  { d: 'm16 17 5-5-5-5' },
  { d: 'M21 12H9' },
  { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' },
])

export const audioWaveformIcon = lucideIcon([
  { d: 'M2 13a2 2 0 0 0 2 2h1' },
  { d: 'M6 21V5a2 2 0 0 1 2-2h1' },
  { d: 'M10 21V9a2 2 0 0 1 2-2h1' },
  { d: 'M14 21V7a2 2 0 0 1 2-2h1' },
  { d: 'M18 21V11a2 2 0 0 1 2-2h1' },
  { d: 'M22 13a2 2 0 0 0-2-2h-1' },
])

export const commandIcon = lucideIcon([
  { d: 'M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' },
])