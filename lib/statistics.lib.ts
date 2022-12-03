import moment from 'moment'
import { ChartData } from '../dtos/chart-data.dto'
import { VaultStats } from '../dtos/vault-stats.dto'

export enum StatisticsChartDataType {
  NUMBER_OF_VAULTS,
  TVL,
  STRATEGY,
}

interface ChartEntry {
  label: string
  data: number
  color: string
}

export function toChartData(stats: VaultStats, type: StatisticsChartDataType): ChartData {
  let entries: ChartEntry[] = []
  switch (type) {
    case StatisticsChartDataType.NUMBER_OF_VAULTS:
      const vaultMaxi =
        stats.botData.doubleMintMaxi.totalVaults +
        stats.botData.dfiSingleMintMaxi.totalVaults +
        stats.botData.dusdSingleMintMaxi.totalVaults

      entries.push({ label: 'Vault Maxi', data: vaultMaxi, color: '#ff00af' })
      entries.push({ label: 'Wizard', data: stats.botData.wizard.totalVaults, color: '#000' })
      entries.push({ label: 'Manual vaults', data: stats.nonEmptyVaults - stats.allBotVaults, color: '#333' })
      break
    case StatisticsChartDataType.TVL:
      entries.push({ label: 'Double mint', data: stats.botData.doubleMintMaxi.totalCollateral, color: '#333' })
      entries.push({ label: 'Single DFI', data: stats.botData.dfiSingleMintMaxi.totalCollateral, color: '#ff00af' })
      entries.push({ label: 'Single DUSD', data: stats.botData.dusdSingleMintMaxi.totalCollateral, color: '#FFCCEF' })
      entries.push({ label: 'Wizard', data: stats.botData.wizard.totalCollateral, color: '#000' })
      break
    case StatisticsChartDataType.STRATEGY:
      entries.push({ label: 'Double mint', data: stats.botData.doubleMintMaxi.totalVaults, color: '#333' })
      entries.push({ label: 'Single DFI', data: stats.botData.dfiSingleMintMaxi.totalVaults, color: '#ff00af' })
      entries.push({ label: 'Single DUSD', data: stats.botData.dusdSingleMintMaxi.totalVaults, color: '#FFCCEF' })
      break
  }
  entries = entries.sort((a, b) => b.data - a.data)
  return {
    labels: entries.map((entry) => entry.label),
    datasets: [
      {
        data: entries.map((entry) => entry.data),
        backgroundColor: entries.map((entry) => entry.color),
        hoverOffset: 4,
      },
    ],
  }
}

export function historyDaysToLoad(): string[] {
  return getDates('2022-11-28').map((date) => date.toISOString().slice(0, 10))
}

function getDates(start: string) {
  for (var arr = [], dt = new Date(start); dt <= new Date(); dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt))
  }
  return arr
}

export function toLineChartData(history: VaultStats[], type: StatisticsChartDataType): ChartData {
  const entries: ChartEntry[] = []

  const vaultMaxi =
    stats.botData.doubleMintMaxi.totalVaults +
    stats.botData.dfiSingleMintMaxi.totalVaults +
    stats.botData.dusdSingleMintMaxi.totalVaults

  entries.push({ label: 'Vault Maxi', data: vaultMaxi, color: '#ff00af' })
  entries.push({ label: 'Wizard', data: stats.botData.wizard.totalVaults, color: '#000' })
  entries.push({ label: 'Manual vaults', data: stats.nonEmptyVaults - stats.allBotVaults, color: '#333' })
  return {
    labels: history.map((entry) => moment(entry.tstamp).format('DD-MM-YYYY')),
    datasets: [
      entries.map((entry) => ({
        label: entry.label,
        data: [entry.data],
        backgroundColor: [entry.color],
        hoverOffset: 4,
      })),
    ],
  }
}
