import { ChartEntry } from '../dtos/chart-entry.dto'
import { ReinvestTarget, ReinvestTargetType } from '../dtos/reinvest-target.dto'

export function toChartEntry(target: ReinvestTarget): ChartEntry {
  if (!target.value || !target.name) throw new Error('Cannot convert empty targets')
  return {
    value: target.value,
    label: target.name,
    color: colorFor(target.name),
    background: backgroundFor(target.name),
  }
}

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

const addressRegex = /^(8\w{33}|d\w{33}|d\w{41})$/
const vaultRegex = /^[a-f0-9]{64}$/i

export function isTargetValid(target: string): boolean {
  return target.match(addressRegex) != null || target.match(vaultRegex) != null
}

export function typeForTarget(target: string): ReinvestTargetType | undefined {
  if (target.match(addressRegex)) return ReinvestTargetType.WALLET
  else if (target.match(vaultRegex)) return ReinvestTargetType.VAULT
  else return undefined
}
