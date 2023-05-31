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
  buildCustomAlgo = false,
  calculateDelta = false,
  keywords = ['Mint', 'Burn'],
): TableData {
  if (buildCustomAlgo) {
    const algoIndex = chartData.labels
      .filter((value) => value.includes('algo'))
      .map((needle) => chartData.labels.findIndex((value) => value === needle))
    const backedIndex = chartData.labels
      .filter((value) => value.includes('backed'))
      .map((needle) => chartData.labels.findIndex((value) => value === needle))
    const algo = algoIndex.map((index) => chartData.datasets[0].data[index]).reduce((prev, curr) => prev + curr, 0)
    const backed = backedIndex.map((index) => chartData.datasets[0].data[index]).reduce((prev, curr) => prev + curr, 0)
    return {
      content: ['', formatNumber(algo).concat(inDollar ? '$' : ''), formatNumber(backed).concat(inDollar ? '$' : '')],
      labels: ['', 'Sum Algo', 'Sum Backed'],
      percentages: [
        '',
        new BigNumber(algo)
          .dividedBy(algo + backed)
          .multipliedBy(100)
          .decimalPlaces(1)
          .toString(),
        new BigNumber(backed)
          .dividedBy(algo + backed)
          .multipliedBy(100)
          .decimalPlaces(1)
          .toString(),
      ],
      colors: [],
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
