import { ChartEntry } from '../dtos/chart-entry.dto'
import { Reinvest } from '../entities/reinvest.entity'

export function toChartEntry(entry: Reinvest): ChartEntry {
  if (!entry.value || !entry.token) throw new Error('Cannot convert empty targets')
  return {
    value: entry.value,
    label: entry.token,
  }
}

export function generateReinvestStringBasedOn(entries: Reinvest[]): string {
  const validEntries = entries.filter((entry) => entry.isValid())
  if (validEntries.length === 0) return 'Reinvest configuration is not valid'
  return validEntries.map((entry) => entry.getReinvestString()).join(' ')
}
