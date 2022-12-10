import moment from 'moment'
import { ChartData } from '../dtos/chart-data.dto'
import { VaultStats } from '../dtos/vault-stats.dto'

export enum StatisticsChartDataType {
  NUMBER_OF_VAULTS,
  COLLATERAL,
  LOAN,
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
  others: '#42f9c2',
  manualToken: '#0821bb',
  manualDUSD: '#42f9c2',
  double: '#333',
  DFI: '#ff00af',
  DUSD: '#ffccef',
}

interface ChartInfo {
  type: StatisticsChartDataType
  sort: boolean
  inDollar: boolean
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
      entries.push({ label: 'Wizard', data: stats.botData.wizard.totalVaults, color: Color.wizard })
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
      entries.push({ label: 'Wizard', data: stats.botData.wizard.totalCollateral, color: Color.wizard })
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

interface TableData {
  content: string[]
  labels: string[]
  percentages: string[]
  colors: string[]
}

export function generateTableContent(chartData: ChartData, { inDollar }: ChartInfo): TableData {
  const total = chartData.datasets[0].data.reduce((curr, prev) => curr + prev)
  const contentNumber = [total].concat(chartData.datasets[0].data)
  const content = contentNumber.map((entry) => formatNumber(entry).concat(inDollar ? '$' : ''))
  const percentages = contentNumber.map((entry) => ((entry / total) * 100).toFixed(1))
  const labels = ['Total'].concat(chartData.labels)
  const colors = [''].concat(chartData.datasets[0].backgroundColor)

  return { content, labels, percentages, colors }
}

function formatNumber(value: number): string {
  let postfix = ''
  let fixed = 0
  if (value > 1e6) {
    value = value / 1e6
    postfix = 'M'
    fixed = 2
  } else if (value > 1e3) {
    value = value / 1e3
    postfix = 'k'
    fixed = 2
  }
  return value
    .toFixed(fixed)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    .concat(postfix)
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
      })
      entries.push({
        label: 'Wizard',
        data: history.map((entry) => entry.botData.wizard.totalVaults),
        color: Color.wizard,
      })
      entries.push({
        label: 'Manual vaults',
        data: history.map((entry) => entry.nonEmptyVaults - entry.allBotVaults),
        color: Color.others,
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
      const manual = history.map((entry) => entry.vaultData?.usedVaults.avgRatio)
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
      hoverOffset: 4,
    })),
  }
}

export function toScales(type: StatisticsChartDataType): any {
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
