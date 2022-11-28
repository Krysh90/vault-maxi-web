import { ChartData } from '../dtos/chart-data.dto'
import { Reinvest } from '../entities/reinvest.entity'

interface ChartInfo {
  ctx?: CanvasRenderingContext2D
  width?: number
  height?: number
}

export function toChartData(entries: Reinvest[], info?: ChartInfo): ChartData {
  const unused = 100 - toTotalValue(entries)
  return {
    labels: toSymbol(entries, unused),
    datasets: [
      {
        data: toData(entries, unused),
        backgroundColor: toSymbol(entries, unused)
          .map((symbol) => backgroundBasedOn(symbol, info))
          .concat(unused > 0 ? ['#222'] : []),
        hoverOffset: 4,
      },
    ],
  }
}

export function toTotalValue(entries: Reinvest[]): number {
  if (entries.length === 0) return 0
  return entries.map((entry) => entry.value).reduce((curr, prev) => curr + prev)
}

function toSymbol(entries: Reinvest[], unused: number): string[] {
  return entries
    .filter((entry) => entry.token)
    .map((entry) => entry.token!.symbol)
    .concat(unused > 0 ? ['Unused'] : [])
}

function toData(entries: Reinvest[], unused: number): number[] {
  const numberOfFills = entries.filter((entry) => entry.value === 0).length
  return entries
    .map((entry) => (entry.value > 0 ? entry.value : unused / numberOfFills))
    .concat(numberOfFills === 0 ? [unused] : [])
}

function backgroundBasedOn(symbol: string, info?: ChartInfo): string | CanvasGradient | undefined {
  if (symbol.includes('-')) return gradientBasedOn(symbol, info)
  return colorBasedOn(symbol)
}

function colorBasedOn(symbol: string): string {
  switch (symbol) {
    case 'DFI':
      return '#ff00af'
    case 'BTC':
      return '#F7931A'
    case 'ETH':
      return '#627EEA'
    case 'BCH':
      return '#0AC18E'
    case 'LTC':
      return '#345D9D'
    case 'DOGE':
      return '#F3EDD6'
    case 'DUSD':
      return '#FFCCEF'
    case 'USDC':
      return '#2775CA'
    case 'USDT':
      return '#26A17B'
    case 'Unused':
      return '#222'
    default:
      return '#444'
  }
}

function gradientBasedOn(symbol: string, info?: ChartInfo): CanvasGradient | undefined {
  if (!symbol.includes('-') || !info) return undefined
  const tokens = symbol.split('-')
  return getArcedGradient(colorBasedOn(tokens[0]), colorBasedOn(tokens[1]), info)
}

function getArcedGradient(startColor: string, endColor: string, info: ChartInfo): CanvasGradient | undefined {
  if (!info.ctx || !info.width || !info.height) return undefined
  const partLength = (2 * Math.PI) / (100 / 50) // 50 => value
  const start = 0

  const xc = info.width / 2
  const yc = info.height / 2
  const r = info.width / 2

  // x start / end of the next arc to draw
  const xStart = xc + Math.cos(start) * r
  const xEnd = xc + Math.cos(start + partLength) * r
  // y start / end of the next arc to draw
  const yStart = yc + Math.sin(start) * r
  const yEnd = yc + Math.sin(start + partLength) * r

  info.ctx.beginPath()

  const gradient = info.ctx.createLinearGradient(xStart, yStart, xEnd, yEnd)
  gradient.addColorStop(0, startColor)
  gradient.addColorStop(1.0, endColor)

  info.ctx.strokeStyle = gradient
  info.ctx.arc(xc, yc, r, start, start + partLength)
  info.ctx.lineWidth = 30
  info.ctx.stroke()
  info.ctx.closePath()

  return gradient
}

export function generateReinvestStringBasedOn(entries: Reinvest[]): string {
  const validEntries = entries.filter((entry) => entry.isValid())
  return validEntries.map((entry) => entry.getReinvestString()).join(',')
}
