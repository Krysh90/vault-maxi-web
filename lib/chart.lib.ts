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

    const content = ['', formatNumber(one).concat(inDollar ? '$' : ''), formatNumber(two).concat(inDollar ? '$' : '')]
    const labels = ['', `Sum ${keywords[0]}`, `Sum ${keywords[1]}`]
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
    const colors = customColors ? [''].concat(...customColors) : []

    if (calculateDelta) {
      content.push(formatNumber(new BigNumber(one).minus(two).toNumber()).concat(inDollar ? '$' : ''))
      labels.push('Delta')
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
    labels.push('Delta')
  }

  return { content, labels, percentages, colors }
}

export function formatNumber(value: number): string {
  let postfix = ''
  let fixed = 0
  if (Math.abs(value) > 1e6) {
    value = value / 1e6
    postfix = 'M'
    fixed = 2
  } else if (Math.abs(value) > 1e3) {
    value = value / 1e3
    postfix = 'k'
    fixed = 2
  }
  return value
    .toFixed(fixed)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    .concat(postfix)
}

export function getDates(start: string) {
  for (var arr = [], dt = new Date(start); dt <= new Date(); dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt))
  }
  return arr
}

export function filterDates(dates: Date[]): Date[] {
  return dates
  // return dates.filter(
  //   (_date, index) =>
  //     index >= dates.length - 30 || (index > 0 && index % 7 === 0) || (index - 365 > 0 && index % 30 === 0),
  // )
}

export interface HistoryChartItem {
  label: string
  type: string
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

export const valueOfTimeFrame: Record<LineChartTimeFrame, number> = {
  [LineChartTimeFrame.ALL]: 0,
  [LineChartTimeFrame.THREE_MONTHS]: -90,
  [LineChartTimeFrame.MONTH]: -30,
  [LineChartTimeFrame.WEEK]: -7,
}

export interface LineChartInfo {
  type: string
  timeFrame: LineChartTimeFrame
}
