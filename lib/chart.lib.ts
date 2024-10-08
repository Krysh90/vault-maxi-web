import BigNumber from 'bignumber.js'
import { ChartData } from '../dtos/chart-data.dto'

export interface ChartEntry {
  label: string
  data: number
  color: string
}

export interface ChartInfo {
  type: string
  sort: boolean
  inDollar: boolean
}

interface TableData {
  content: string[]
  labels: string[]
  percentages: string[]
  colors: string[]
}

export function generateTableContent(
  chartData: ChartData,
  { inDollar }: ChartInfo,
  showTotal = true,
  buildCustom = false,
  calculateDelta = false,
  keywords = ['Mint', 'Burn'],
  customColors?: string[],
  customDeltaLabel?: string,
  specialDusdDelta = false,
): TableData {
  if (buildCustom) {
    const oneIndex = chartData.labels
      .filter((value) => value.includes(keywords[0]))
      .map((needle) => chartData.labels.findIndex((value) => value === needle))
    const twoIndex = chartData.labels
      .filter((value) => value.includes(keywords[1]))
      .map((needle) => chartData.labels.findIndex((value) => value === needle))
    const one = oneIndex.map((index) => chartData.datasets[0].data[index]).reduce((prev, curr) => prev + curr, 0)
    const two = twoIndex.map((index) => chartData.datasets[0].data[index]).reduce((prev, curr) => prev + curr, 0)

    const content = [
      formatNumber(chartData.datasets[0].data.reduce((curr, prev) => curr + prev, 0)).concat(inDollar ? '$' : ''),
      formatNumber(one).concat(inDollar ? '$' : ''),
      formatNumber(two).concat(inDollar ? '$' : ''),
    ]
    const labels = ['Total', `Sum ${keywords[0]}`, `Sum ${keywords[1]}`]
    const percentages = [
      '',
      new BigNumber(one)
        .dividedBy(one + two)
        .multipliedBy(100)
        .decimalPlaces(1)
        .toString(),
      new BigNumber(two)
        .dividedBy(one + two)
        .multipliedBy(100)
        .decimalPlaces(1)
        .toString(),
    ]
    if (!showTotal) {
      labels[0] = ''
      content[0] = ''
    }
    const colors = customColors ? [''].concat(...customColors) : []

    if (calculateDelta) {
      content.push(formatNumber(new BigNumber(one).minus(two).toNumber()).concat(inDollar ? '$' : ''))
      labels.push(customDeltaLabel ?? 'Delta')
      percentages.push('')
      colors.push('')
    }

    return {
      content,
      labels,
      percentages,
      colors,
    }
  }
  const total = chartData.datasets[0].data.reduce((curr, prev) => curr + prev, 0)
  const contentNumber = [total].concat(chartData.datasets[0].data)
  const content = contentNumber.map((entry) => formatNumber(entry).concat(inDollar ? '$' : ''))
  const percentages = contentNumber.map((entry) => ((entry / total) * 100).toFixed(1))
  const labels = ['Total'].concat(chartData.labels)
  const colors = [''].concat(chartData.datasets[0].backgroundColor)

  if (!showTotal) {
    labels[0] = ''
    content[0] = ''
  }

  if (calculateDelta) {
    const mintedIndex = chartData.labels
      .filter((value) => value.includes(keywords[0]))
      .map((needle) => chartData.labels.findIndex((value) => value === needle))
    const burnedIndex = chartData.labels
      .filter((value) => value.includes(keywords[1]))
      .map((needle) => chartData.labels.findIndex((value) => value === needle))
    const minted = mintedIndex.map((index) => chartData.datasets[0].data[index]).reduce((prev, curr) => prev + curr, 0)
    const burned = burnedIndex.map((index) => chartData.datasets[0].data[index]).reduce((prev, curr) => prev + curr, 0)
    content.push(formatNumber(minted - burned).concat(inDollar ? '$' : ''))
    percentages.push('')
    labels.push(customDeltaLabel ?? 'Delta')
  }

  if (specialDusdDelta) {
    const mintDusdIndex = chartData.labels
      .filter((value) => value.includes('Minted dUSD'))
      .map((needle) => chartData.labels.findIndex((value) => value === needle))
    const burnedDusdIndex = chartData.labels
      .filter((value) => value.includes('Burned dUSD'))
      .map((needle) => chartData.labels.findIndex((value) => value === needle))
    const mintDusd = mintDusdIndex
      .map((index) => chartData.datasets[0].data[index])
      .reduce((prev, curr) => prev + curr, 0)
    const burnedDusd = burnedDusdIndex
      .map((index) => chartData.datasets[0].data[index])
      .reduce((prev, curr) => prev + curr, 0)
    content.push(formatNumber(new BigNumber(mintDusd).minus(burnedDusd).toNumber()))
    labels.push('dUSD delta')
    percentages.push('')
    colors.push('')
  }

  return { content, labels, percentages, colors }
}

export function formatNumber(value: number, forceFixed?: number): string {
  let postfix = ''
  let fixed = forceFixed ?? 0
  if (Math.abs(value) > 1e6) {
    value = value / 1e6
    postfix = 'M'
    fixed = forceFixed ?? 2
  } else if (Math.abs(value) > 1e3) {
    value = value / 1e3
    postfix = 'k'
    fixed = forceFixed ?? 2
  }
  return value
    .toFixed(fixed)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    .concat(postfix)
}

export function getDates(start: string) {
  for (var arr = [], dt = new Date(start); dt <= new Date(); dt.setUTCDate(dt.getUTCDate() + 1)) {
    arr.push(new Date(dt))
  }
  return arr
}

export function filterDates(dates: Date[]): Date[] {
  // return dates.slice(-90)
  // return dates.filter(
  //   (_date, index) =>
  //     index >= dates.length - 90 ||
  //     (index - 365 < 0 && index - 90 > 0 && index % 7 === 0) ||
  //     (index - 365 > 0 && index % 30 === 0),
  // )
  return dates.filter((_date, index) => index >= dates.length - 28 || index % 7 === 0)
}

export function scanByTimeFrame<T>(x: T[], timeFrame: LineChartTimeFrame): T[] {
  switch (timeFrame) {
    case LineChartTimeFrame.ALL:
      return x
        .slice()
        .reverse()
        .filter((_, index) => index >= 28 || (index < 28 && index % 7 === 0))
        .reverse()
    case LineChartTimeFrame.THREE_MONTHS:
      return x
        .slice()
        .reverse()
        .filter((_, index) => index >= 28 || (index < 28 && index % 7 === 0))
        .reverse()
        .slice(-14)
    case LineChartTimeFrame.MONTH:
      return x.slice(-28)
    case LineChartTimeFrame.WEEK:
      return x.slice(-7)
  }
}

export interface HistoryChartItem {
  label: string
  type: string
  showZeroLine?: boolean
}

export interface LineChartEntry {
  label: string
  data: number[]
  color: string
}

export enum LineChartTimeFrame {
  ALL = 'All',
  THREE_MONTHS = 'Last 3 months',
  MONTH = 'Last month',
  WEEK = 'Last week',
}

export interface LineChartInfo {
  type: string
  timeFrame: LineChartTimeFrame
}
