import moment from 'moment'
import { ChartData } from '../dtos/chart-data.dto'
import { VaultStats } from '../dtos/vault-stats.dto'

export enum StatisticsChartDataType {
  NUMBER_OF_VAULTS,
  COLLATERAL,
  STRATEGY,
  AVERAGE_COLLATERAL_RATIO,
  DONATION,
}

interface ChartEntry {
  label: string
  data: number
  color: string
}

const Color = {
  vaultMaxi: '#ff00af',
  wizard: '#000',
  others: '#333',
  double: '#333',
  DFI: '#ff00af',
  DUSD: '#ffccef',
}

export function toChartData(stats: VaultStats, type: StatisticsChartDataType): ChartData {
  let entries: ChartEntry[] = []
  switch (type) {
    case StatisticsChartDataType.NUMBER_OF_VAULTS:
      const vaultMaxi =
        stats.botData.doubleMintMaxi.totalVaults +
        stats.botData.dfiSingleMintMaxi.totalVaults +
        stats.botData.dusdSingleMintMaxi.totalVaults

      entries.push({ label: 'Vault Maxi', data: vaultMaxi, color: Color.vaultMaxi })
      entries.push({ label: 'Wizard', data: stats.botData.wizard.totalVaults, color: Color.wizard })
      entries.push({ label: 'Manual vaults', data: stats.nonEmptyVaults - stats.allBotVaults, color: Color.others })
      break
    case StatisticsChartDataType.COLLATERAL:
      entries.push({ label: 'Double mint', data: stats.botData.doubleMintMaxi.totalCollateral, color: Color.double })
      entries.push({ label: 'Single DFI', data: stats.botData.dfiSingleMintMaxi.totalCollateral, color: Color.DFI })
      entries.push({ label: 'Single DUSD', data: stats.botData.dusdSingleMintMaxi.totalCollateral, color: Color.DUSD })
      entries.push({ label: 'Wizard', data: stats.botData.wizard.totalCollateral, color: Color.wizard })
      break
    case StatisticsChartDataType.STRATEGY:
      entries.push({ label: 'Double mint', data: stats.botData.doubleMintMaxi.totalVaults, color: Color.double })
      entries.push({ label: 'Single DFI', data: stats.botData.dfiSingleMintMaxi.totalVaults, color: Color.DFI })
      entries.push({ label: 'Single DUSD', data: stats.botData.dusdSingleMintMaxi.totalVaults, color: Color.DUSD })
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

interface LineChartEntry {
  label: string
  data: number[]
  color: string
  scale?: string
}

export function toLineChartData(history: VaultStats[], type: StatisticsChartDataType): ChartData {
  const entries: LineChartEntry[] = []

  switch (type) {
    case StatisticsChartDataType.NUMBER_OF_VAULTS:
      entries.push({
        label: 'Vault Maxi',
        data: history.map(
          (entry) =>
            entry.botData.doubleMintMaxi.totalVaults +
            entry.botData.dfiSingleMintMaxi.totalVaults +
            entry.botData.dusdSingleMintMaxi.totalVaults,
        ),
        color: Color.vaultMaxi,
        scale: 'maxi',
      })
      entries.push({
        label: 'Wizard',
        data: history.map((entry) => entry.botData.wizard.totalVaults),
        color: Color.wizard,
        scale: 'wizard',
      })
      entries.push({
        label: 'Manual vaults',
        data: history.map((entry) => entry.nonEmptyVaults - entry.allBotVaults),
        color: Color.others,
        scale: 'others',
      })
      break
    case StatisticsChartDataType.COLLATERAL:
      entries.push({
        label: 'Double mint',
        data: history.map((entry) => entry.botData.doubleMintMaxi.totalCollateral),
        color: Color.double,
      })
      entries.push({
        label: 'Single DFI',
        data: history.map((entry) => entry.botData.dfiSingleMintMaxi.totalCollateral),
        color: Color.DFI,
      })
      entries.push({
        label: 'Single DUSD',
        data: history.map((entry) => entry.botData.dusdSingleMintMaxi.totalCollateral),
        color: Color.DUSD,
      })
      break
    case StatisticsChartDataType.AVERAGE_COLLATERAL_RATIO:
      entries.push({
        label: 'Double mint',
        data: history.map((entry) => entry.botData.doubleMintMaxi.avgRatio),
        color: Color.double,
      })
      entries.push({
        label: 'Single DFI',
        data: history.map((entry) => entry.botData.dfiSingleMintMaxi.avgRatio),
        color: Color.DFI,
      })
      entries.push({
        label: 'Single DUSD',
        data: history.map((entry) => entry.botData.dusdSingleMintMaxi.avgRatio),
        color: Color.DUSD,
      })
      break
    case StatisticsChartDataType.STRATEGY:
      entries.push({
        label: 'Double mint',
        data: history.map((entry) => entry.botData.doubleMintMaxi.totalVaults),
        color: Color.double,
      })
      entries.push({
        label: 'Single DFI',
        data: history.map((entry) => entry.botData.dfiSingleMintMaxi.totalVaults),
        color: Color.DFI,
      })
      entries.push({
        label: 'Single DUSD',
        data: history.map((entry) => entry.botData.dusdSingleMintMaxi.totalVaults),
        color: Color.DUSD,
      })
      break
    case StatisticsChartDataType.DONATION:
      entries.push({
        label: 'Auto-Donation activated',
        data: history.map((entry) => entry.donatingMaxis),
        color: Color.vaultMaxi,
      })
      break
  }

  return {
    labels: history.map((entry) => moment(entry.tstamp).format('DD-MM-YYYY')),
    datasets: entries.map((entry) => ({
      label: entry.label,
      data: entry.data,
      borderColor: [entry.color],
      backgroundColor: [entry.color],
      yAxisID: entry.scale,
      hoverOffset: 4,
    })),
  }
}

export function toScales(type: StatisticsChartDataType): any {
  const scale = {
    type: 'linear' as const,
    display: false,
    position: 'left',
  }
  switch (type) {
    case StatisticsChartDataType.NUMBER_OF_VAULTS:
      return {
        maxi: scale,
        wizard: scale,
        others: scale,
      }
    case StatisticsChartDataType.AVERAGE_COLLATERAL_RATIO:
    case StatisticsChartDataType.STRATEGY:
    case StatisticsChartDataType.DONATION:
    default:
      return undefined
  }
}
