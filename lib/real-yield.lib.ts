import { ChartData } from '../dtos/chart-data.dto'
import { RealYieldInfo, RealYieldStats } from '../dtos/real-yield-stats.dto'
import { ChartEntry, ChartInfo, getDates } from './chart.lib'
import { colorBasedOn } from './colors.lib'

export enum RealYieldChartDataType {
  FEE = 'FEE',
  COMMISSION_CRYPTO = 'COMMISSION_CRYPTO',
  COMMISSION_TOKEN = 'COMMISSION_TOKEN',
}

export function historyDaysToLoad(): string[] {
  return getDates('2023-01-30').map((date) => date.toISOString().slice(0, 10))
}

function calcFee(info: RealYieldInfo): number {
  return ((info.usdValue ?? 0) / (info.commission + info.fee)) * info.fee
}

function calcCommission(info: RealYieldInfo): number {
  return ((info.usdValue ?? 0) / (info.commission + info.fee)) * info.commission
}

function sumAllBelowLimit(values: number[], limit: number): number {
  return values.filter((value) => value <= limit).reduce((prev, curr) => prev + curr, 0)
}

export const listOfCryptos = ['DFI', 'BTC', 'ETH', 'LTC', 'BCH', 'DOGE', 'USDT', 'USDC']

export function toChartData(stats: RealYieldStats, { type, sort }: ChartInfo): ChartData {
  let entries: ChartEntry[] = []
  switch (type) {
    case RealYieldChartDataType.FEE:
      const feeLimit = stats.totalUSD.fee * 0.005
      const allTokenFees = Object.entries(stats.tokens).map(([symbol, info]) => ({
        label: symbol,
        data: calcFee(info),
        color: colorBasedOn(symbol),
      }))
      entries = allTokenFees.filter((entry) => entry.data > feeLimit)
      entries = entries.concat({
        label: 'Others',
        data: sumAllBelowLimit(
          allTokenFees.map((entry) => entry.data),
          feeLimit,
        ),
        color: '#42f9c2',
      })
      break
    case RealYieldChartDataType.COMMISSION_CRYPTO:
    case RealYieldChartDataType.COMMISSION_TOKEN:
      const commissionLimit = stats.totalUSD.commission * 0.02
      const allCommissions = Object.entries(stats.tokens)
        .filter(([symbol]) =>
          type === RealYieldChartDataType.COMMISSION_CRYPTO
            ? listOfCryptos.includes(symbol)
            : !listOfCryptos.includes(symbol),
        )
        .map(([symbol, info]) => ({
          label: symbol,
          data: calcCommission(info),
          color: colorBasedOn(symbol),
        }))
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
