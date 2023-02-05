import { colorBasedOn } from './colors.lib'
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
          .concat(unused > 0 ? [colorBasedOn('Unused')] : []),
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

export function generateReinvestStringBasedOn(entries: Reinvest[]): string {
  const validEntries = entries.filter((entry) => entry.isValid())
  return validEntries.map((entry) => entry.getReinvestString()).join(',')
}
