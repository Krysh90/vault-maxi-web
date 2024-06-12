import moment from 'moment'
import { ChartData } from '../dtos/chart-data.dto'
import { VaultStats } from '../dtos/vault-stats.dto'
import {
  ChartEntry,
  ChartInfo,
  filterDates,
  getDates,
  LineChartEntry,
  LineChartInfo,
  scanByTimeFrame,
} from './chart.lib'

export enum StatisticsChartDataType {
  NUMBER_OF_VAULTS = 'NUMBER_OF_VAULTS',
  COLLATERAL = 'COLLATERAL',
  LOAN = 'LOAN',
  STRATEGY = 'STRATEGY',
  AVERAGE_COLLATERAL_RATIO = 'AVERAGE_COLLATERAL_RATIO',
  DONATION = 'DONATION',
}

const Color = {
  vaultMaxi: '#ff00af',
  others: '#42f9c2',
  manualToken: '#0821bb',
  manualDUSD: '#42f9c2',
  double: '#333',
  DFI: '#ff00af',
  DUSD: '#ffccef',
}

export function toChartData(stats: VaultStats, { type, sort }: ChartInfo): ChartData {
  let entries: ChartEntry[] = []
  switch (type) {
    case StatisticsChartDataType.NUMBER_OF_VAULTS:
      const vaultMaxi =
        stats.botData.doubleMintMaxi.totalVaults +
        stats.botData.dfiSingleMintMaxi.totalVaults +
        stats.botData.dusdSingleMintMaxi.totalVaults

      entries.push({ label: 'Vault Maxi', data: vaultMaxi, color: Color.vaultMaxi })
      entries.push({ label: 'Manual vaults', data: stats.nonEmptyVaults - stats.allBotVaults, color: Color.others })
      break
    case StatisticsChartDataType.LOAN:
      const dusdManual = stats.vaultData.nonEmptyVaults.totalDUSDLoans - stats.botData.allBotVaults.totalDUSDLoans
      const totalManual = stats.vaultData.nonEmptyVaults.totalLoans - stats.botData.allBotVaults.totalLoans
      entries.push({ label: 'DUSD manual', data: dusdManual, color: Color.manualDUSD })
      entries.push({ label: 'dToken manual', data: totalManual - dusdManual, color: Color.manualToken })
      entries.push({ label: 'DUSD bots', data: stats.botData.allBotVaults.totalDUSDLoans, color: Color.DUSD })
      entries.push({
        label: 'dToken bots',
        data: stats.botData.allBotVaults.totalLoans - stats.botData.allBotVaults.totalDUSDLoans,
        color: Color.double,
      })
      break
    case StatisticsChartDataType.COLLATERAL:
      entries.push({ label: 'Double mint', data: stats.botData.doubleMintMaxi.totalCollateral, color: Color.double })
      entries.push({ label: 'Single DFI', data: stats.botData.dfiSingleMintMaxi.totalCollateral, color: Color.DFI })
      entries.push({ label: 'Single DUSD', data: stats.botData.dusdSingleMintMaxi.totalCollateral, color: Color.DUSD })
      break
    case StatisticsChartDataType.STRATEGY:
      entries.push({ label: 'Double mint', data: stats.botData.doubleMintMaxi.totalVaults, color: Color.double })
      entries.push({ label: 'Single DFI', data: stats.botData.dfiSingleMintMaxi.totalVaults, color: Color.DFI })
      entries.push({ label: 'Single DUSD', data: stats.botData.dusdSingleMintMaxi.totalVaults, color: Color.DUSD })
      break
  }
  if (sort) entries = entries.sort((a, b) => b.data - a.data)
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
  return filterDates(getDates('2022-11-28')).map((date) => date.toISOString().slice(0, 10))
}

export function toLineChartData(history: VaultStats[], { type, timeFrame }: LineChartInfo): ChartData {
  const entries: LineChartEntry[] = []
  const historyToCheck = scanByTimeFrame(history, timeFrame)

  switch (type) {
    case StatisticsChartDataType.NUMBER_OF_VAULTS:
      entries.push({
        label: 'Vault Maxi',
        data: historyToCheck.map(
          (entry) =>
            entry.botData.doubleMintMaxi.totalVaults +
            entry.botData.dfiSingleMintMaxi.totalVaults +
            entry.botData.dusdSingleMintMaxi.totalVaults,
        ),
        color: Color.vaultMaxi,
      })
      entries.push({
        label: 'Manual vaults',
        data: historyToCheck.map((entry) => entry.nonEmptyVaults - entry.allBotVaults),
        color: Color.others,
      })
      break
    case StatisticsChartDataType.COLLATERAL:
      entries.push({
        label: 'Double mint',
        data: historyToCheck.map((entry) => entry.botData.doubleMintMaxi.totalCollateral),
        color: Color.double,
      })
      entries.push({
        label: 'Single DFI',
        data: historyToCheck.map((entry) => entry.botData.dfiSingleMintMaxi.totalCollateral),
        color: Color.DFI,
      })
      entries.push({
        label: 'Single DUSD',
        data: historyToCheck.map((entry) => entry.botData.dusdSingleMintMaxi.totalCollateral),
        color: Color.DUSD,
      })
      break
    case StatisticsChartDataType.AVERAGE_COLLATERAL_RATIO:
      entries.push({
        label: 'Double mint',
        data: historyToCheck.map((entry) => entry.botData.doubleMintMaxi.avgRatio),
        color: Color.double,
      })
      entries.push({
        label: 'Single DFI',
        data: historyToCheck.map((entry) => entry.botData.dfiSingleMintMaxi.avgRatio),
        color: Color.DFI,
      })
      entries.push({
        label: 'Single DUSD',
        data: historyToCheck.map((entry) => entry.botData.dusdSingleMintMaxi.avgRatio),
        color: Color.DUSD,
      })
      const manual = historyToCheck.map((entry) => entry.vaultData?.usedVaults.avgRatio)
      if (manual.filter((entry) => entry != null).length > 2) {
        entries.push({
          label: 'Manual',
          data: manual,
          color: Color.others,
        })
      }
      break
    case StatisticsChartDataType.STRATEGY:
      entries.push({
        label: 'Double mint',
        data: historyToCheck.map((entry) => entry.botData.doubleMintMaxi.totalVaults),
        color: Color.double,
      })
      entries.push({
        label: 'Single DFI',
        data: historyToCheck.map((entry) => entry.botData.dfiSingleMintMaxi.totalVaults),
        color: Color.DFI,
      })
      entries.push({
        label: 'Single DUSD',
        data: historyToCheck.map((entry) => entry.botData.dusdSingleMintMaxi.totalVaults),
        color: Color.DUSD,
      })
      break
    case StatisticsChartDataType.DONATION:
      entries.push({
        label: 'Auto-Donation activated',
        data: historyToCheck.map((entry) => entry.donatingMaxis),
        color: Color.vaultMaxi,
      })
      break
  }

  return {
    labels: historyToCheck.map((entry) => moment(entry.tstamp).utc().format('DD-MM-YYYY')),
    datasets: entries.map((entry) => ({
      label: entry.label,
      data: entry.data,
      borderColor: [entry.color],
      backgroundColor: [entry.color],
      hoverOffset: 4,
    })),
  }
}

export function toScales(type: string): any {
  const logScale = { y: { type: 'logarithmic', display: true, position: 'left' } }
  switch (type) {
    case StatisticsChartDataType.NUMBER_OF_VAULTS:
      return logScale
    case StatisticsChartDataType.AVERAGE_COLLATERAL_RATIO:
    case StatisticsChartDataType.STRATEGY:
    case StatisticsChartDataType.DONATION:
    default:
      return undefined
  }
}
