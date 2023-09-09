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
  valueOfTimeFrame,
} from './chart.lib'
import { VolumeStats } from '../dtos/volume.dto'
import BigNumber from 'bignumber.js'
import { colorBasedOn } from './colors.lib'

export enum VolumeChartDataType {
  VOLUME = 'VOLUME',
  POOL = 'POOL',
  TOTAL_POOL = 'TOTAL_POOL',
  POOL_DELTA = 'POOL_DELTA',
}

const Color = {
  light: { buys: '#00eeee', sells: '#ff2e22' },
  dark: { buys: '#00aaaa', sells: '#cc241b' },
}

export function toChartData(stats: VolumeStats, { type, sort }: ChartInfo): ChartData {
  let entries: ChartEntry[] = []
  switch (type) {
    case VolumeChartDataType.VOLUME:
      const totalBuys = stats.dfiVolume
        .map((i) => new BigNumber(i.totalBuying).minus(i.buyingFromBigSwaps))
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      const totalBuysBig = stats.dfiVolume
        .map((i) => new BigNumber(i.buyingFromBigSwaps))
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      const totalSells = stats.dfiVolume
        .map((i) => new BigNumber(i.totalSelling).minus(i.sellingFromBigSwaps))
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      const totalSellsBig = stats.dfiVolume
        .map((i) => new BigNumber(i.sellingFromBigSwaps))
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      entries.push({
        label: `Buys`,
        data: totalBuys.toNumber(),
        color: Color.light.buys,
      })
      entries.push({
        label: `Buys above 50k`,
        data: totalBuysBig.toNumber(),
        color: Color.dark.buys,
      })
      entries.push({
        label: `Sells above 50k`,
        data: totalSellsBig.toNumber(),
        color: Color.dark.sells,
      })
      entries.push({
        label: `Sells`,
        data: totalSells.toNumber(),
        color: Color.light.sells,
      })
      break
    case VolumeChartDataType.POOL: {
      const totalBuys = stats.dfiVolume
        .map((i) => new BigNumber(i.totalBuying))
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      const totalSells = stats.dfiVolume
        .map((i) => new BigNumber(i.totalSelling))
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      const delta = totalBuys.minus(totalSells).abs()
      entries.push(
        ...stats.dfiVolume.map((i) => ({
          label: `${i.symbol} Buys`,
          data: i.totalBuying,
          color: colorBasedOn(i.symbol),
        })),
      )
      entries.push({ label: 'Delta', data: delta.toNumber(), color: '#111' })
      entries.push(
        ...stats.dfiVolume
          .map((i) => ({
            label: `${i.symbol} Sells`,
            data: i.totalSelling,
            color: colorBasedOn(i.symbol),
          }))
          .reverse(),
      )
      break
    }
    case VolumeChartDataType.TOTAL_POOL:
      const topX = 5
      const volumeEntries = stats.dfiVolume
        .map((token) => ({
          label: token.symbol,
          data: new BigNumber(token.totalBuying).plus(token.totalSelling).toNumber(),
          color: colorBasedOn(token.symbol),
        }))
        .sort((a, b) => b.data - a.data)
      entries.push(...volumeEntries.slice(0, topX))
      entries.push({
        label: 'Others',
        data: volumeEntries
          .slice(topX)
          .map((e) => e.data)
          .reduce((prev, curr) => prev + curr, 0),
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

export function historyDaysToLoad(): string[] {
  return filterDates(getDates('2023-07-27')).map((date) => date.toISOString().slice(0, 10))
}

function getAllSymbols(stats: VolumeStats): string[] {
  return stats.dfiVolume.map((i) => i.symbol)
}

export function toLineChartData(history: VolumeStats[], { type, timeFrame }: LineChartInfo): ChartData {
  const entries: LineChartEntry[] = []
  const symbols = getAllSymbols(history.slice(-1)[0])
  switch (type) {
    case VolumeChartDataType.VOLUME:
      entries.push({
        label: 'Buys',
        data: history.map((day) => {
          const totalBuys = day.dfiVolume
            .map((i) => new BigNumber(i.totalBuying).minus(i.buyingFromBigSwaps))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalBuys).decimalPlaces(2).toNumber()
        }),
        color: Color.light.buys,
      })
      entries.push({
        label: 'Buys above 50k',
        data: history.map((day) => {
          const totalBuys = day.dfiVolume
            .map((i) => new BigNumber(i.buyingFromBigSwaps))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalBuys).decimalPlaces(2).toNumber()
        }),
        color: Color.dark.buys,
      })
      entries.push({
        label: 'Sells',
        data: history.map((day) => {
          const totalSells = day.dfiVolume
            .map((i) => new BigNumber(-i.totalSelling).plus(i.sellingFromBigSwaps))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalSells).decimalPlaces(2).toNumber()
        }),
        color: Color.light.sells,
      })
      entries.push({
        label: 'Sells above 50k',
        data: history.map((day) => {
          const totalSells = day.dfiVolume
            .map((i) => new BigNumber(-i.sellingFromBigSwaps))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalSells).decimalPlaces(2).toNumber()
        }),
        color: Color.dark.sells,
      })
      entries.push({
        label: 'Delta',
        data: history.map((day) => {
          const totalBuys = day.dfiVolume
            .map((i) => new BigNumber(i.totalBuying))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          const totalSells = day.dfiVolume
            .map((i) => new BigNumber(i.totalSelling))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalBuys).minus(totalSells).decimalPlaces(2).toNumber()
        }),
        color: '#fff',
      })
      entries.push({
        label: 'Delta above 50k',
        data: history.map((day) => {
          const totalBuys = day.dfiVolume
            .map((i) => new BigNumber(i.buyingFromBigSwaps))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          const totalSells = day.dfiVolume
            .map((i) => new BigNumber(i.sellingFromBigSwaps))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalBuys).minus(totalSells).decimalPlaces(2).toNumber()
        }),
        color: '#999',
      })
      break
    case VolumeChartDataType.TOTAL_POOL:
      entries.push(
        ...symbols.map((symbol) => ({
          label: symbol,
          data: history.map((day) => {
            const value = day.dfiVolume
              .filter((i) => i.symbol === symbol)
              .map((i) => new BigNumber(i.totalBuying).plus(i.totalSelling))
              .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
            return value.decimalPlaces(2).toNumber()
          }),
          color: colorBasedOn(symbol),
        })),
      )
      break
    case VolumeChartDataType.POOL_DELTA:
      entries.push(
        ...symbols.map((symbol) => ({
          label: symbol,
          data: history.map((day) => {
            const value = day.dfiVolume
              .filter((i) => i.symbol === symbol)
              .map((i) => new BigNumber(i.totalBuying).minus(i.totalSelling))
              .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
            return value.decimalPlaces(2).toNumber()
          }),
          color: colorBasedOn(symbol),
        })),
      )
      break
  }

  return {
    labels: history
      .map((entry) => moment(entry.meta.tstamp).utc().format('DD-MM-YYYY'))
      .slice(valueOfTimeFrame[timeFrame]),
    datasets: entries.map((entry) => ({
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
