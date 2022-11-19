import { ChartEntry } from '../dtos/chart-entry.dto'
import { Reinvest } from '../entities/reinvest.entity'

export function toChartEntry(entry: Reinvest): ChartEntry {
  if (!entry.value || !entry.token) throw new Error('Cannot convert empty targets')
  return {
    value: entry.value,
    label: entry.token.symbol,
  }
}

export function generateReinvestStringBasedOn(entries: Reinvest[]): string {
  const validEntries = entries.filter((entry) => entry.isValid())
  return validEntries.map((entry) => entry.getReinvestString()).join(' ')
}
