import { ChartData } from '../dtos/chart-data.dto'
import { Reinvest } from '../entities/reinvest.entity'

export function toChartData(entries: Reinvest[]): ChartData {
  const unused = 100 - toTotalValue(entries)
  return {
    labels: toSymbol(entries, unused),
    datasets: [
      {
        data: toData(entries, unused),
        backgroundColor: toSymbol(entries, unused)
          .map((symbol) => colorBasedOn(symbol))
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

export function generateReinvestStringBasedOn(entries: Reinvest[]): string {
  const validEntries = entries.filter((entry) => entry.isValid())
  return validEntries.map((entry) => entry.getReinvestString()).join(',')
}
