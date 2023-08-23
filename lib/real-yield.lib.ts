import moment from 'moment'
import { ChartData } from '../dtos/chart-data.dto'
import { RealYieldStats } from '../dtos/real-yield-stats.dto'
import {
  ChartEntry,
  ChartInfo,
  filterDates,
  getDates,
  LineChartEntry,
  LineChartInfo,
  valueOfTimeFrame,
} from './chart.lib'
import { adjustColor, colorBasedOn } from './colors.lib'

export enum RealYieldChartDataType {
  FEE = 'FEE',
  COMMISSION_CRYPTO = 'COMMISSION_CRYPTO',
  COMMISSION_TOKEN = 'COMMISSION_TOKEN',
  OVERALL = 'OVERALL',
  COMMISSION = 'COMMISSION',
}

export function historyDaysToLoad(): string[] {
  return filterDates(getDates('2023-01-30')).map((date) => date.toISOString().slice(0, 10))
}

export function getAllSymbols(stats: RealYieldStats): string[] {
  return Object.keys(stats.tokens)
}

function sumAllBelowLimit(values: number[], limit: number): number {
  return values.filter((value) => value <= limit).reduce((prev, curr) => prev + curr, 0)
}

export const listOfCryptos = ['DFI', 'BTC', 'ETH', 'LTC', 'BCH', 'DOGE', 'USDT', 'USDC', 'EUROC', 'DOT', 'MATIC', 'SOL']

export function toChartData(stats: RealYieldStats, { type, sort }: ChartInfo): ChartData {
  let entries: ChartEntry[] = []
  switch (type) {
    case RealYieldChartDataType.FEE:
      entries = Object.entries(stats.tokens)
        .map(([symbol, info]) => ({
          label: symbol,
          data: info.feeInUSD,
          color: colorBasedOn(symbol),
        }))
        .filter((value) => value.data > 0)
      break
    case RealYieldChartDataType.COMMISSION_CRYPTO:
    case RealYieldChartDataType.COMMISSION_TOKEN:
      const allCommissions = Object.entries(stats.tokens)
        .filter(([symbol]) =>
          type === RealYieldChartDataType.COMMISSION_CRYPTO
            ? listOfCryptos.includes(symbol)
            : !listOfCryptos.includes(symbol),
        )
        .map(([symbol, info], index) => {
          const color = colorBasedOn(symbol)
          return {
            label: symbol,
            data: info.commissionInUSD,
            color: color === '#444444' ? adjustColor(color, index * 2) : color,
          }
        })
      const commissionLimit = allCommissions.map((e) => e.data).reduce((curr, prev) => curr + prev, 0) * 0.02
      entries = allCommissions.filter((entry) => entry.data > commissionLimit)
      entries = entries.concat({
        label: 'Others',
        data: sumAllBelowLimit(
          allCommissions.map((entry) => entry.data),
          commissionLimit,
        ),
        color: '#42f9c2',
      })
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

const Color = {
  fee: '#0821bb',
  commission: '#42f9c2',
}

export function toLineChartData(history: RealYieldStats[], { type, timeFrame }: LineChartInfo): ChartData {
  const entries: LineChartEntry[] = []
  const symbols = getAllSymbols(history.slice(-1)[0])
  switch (type) {
    case RealYieldChartDataType.OVERALL:
      entries.push({
        label: 'Fee',
        data: history.map((entry) => entry.totalUSD.fee),
        color: Color.fee,
      })
      entries.push({
        label: 'Commission',
        data: history.map((entry) => entry.totalUSD.commission),
        color: Color.commission,
      })
      break
    case RealYieldChartDataType.FEE:
      entries.push(
        ...symbols.map((symbol) => ({
          label: symbol,
          data: history.map((h) => h.tokens[symbol]?.feeInUSD ?? 0),
          color: colorBasedOn(symbol),
        })),
      )
      break
    case RealYieldChartDataType.COMMISSION:
      entries.push(
        ...symbols.map((symbol) => ({
          label: symbol,
          data: history.map((h) => h.tokens[symbol]?.commissionInUSD ?? 0),
          color: colorBasedOn(symbol),
        })),
      )
  }

  return {
    labels: history
      .map((entry) => moment(entry.meta.tstamp).utc().format('DD-MM-YYYY'))
      .slice(valueOfTimeFrame[timeFrame]),
    datasets: entries
      .filter((entry) => !entry.data.slice(-30).every((value) => value < 100))
      .map((entry) => ({
        label: entry.label,
        data: entry.data.slice(valueOfTimeFrame[timeFrame]),
        borderColor: [entry.color],
        backgroundColor: [entry.color],
        hoverOffset: 4,
      })),
  }
}

export function toScales(type: string): any {
  return undefined
}
