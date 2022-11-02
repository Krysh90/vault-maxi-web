import { ChartEntry } from '../dtos/chart-entry.dto'
import { ReinvestTarget } from '../dtos/reinvest-target.dto'

export function toChartEntry(target: ReinvestTarget): ChartEntry {
  return {
    value: target.value,
    label: target.name,
    color: colorFor(target.name),
    background: backgroundFor(target.name),
  }
}
const DFI = { value: 30, label: 'DFI', color: '#ff00af', background: 'bg-[#ff00af]' }
const BTC = { value: 30, label: 'BTC', color: '#f2a900', background: 'bg-[#f2a900]' }
const ETH = { value: 20, label: 'ETH', color: '#37367b', background: 'bg-[#37367b]' }

function colorFor(name: string): string {
  switch (name) {
    case 'DFI':
      return '#ff00af'
    case 'BTC':
      return '#f2a900'
    case 'ETH':
      return '#37367b'
  }
  return '#123456'
}

function backgroundFor(name: string): string {
  switch (name) {
    case 'DFI':
      return 'bg-[#ff00af]'
    case 'BTC':
      return 'bg-[#f2a900]'
    case 'ETH':
      return 'bg-[#37367b]'
  }
  return 'bg-[#123456]'
}
