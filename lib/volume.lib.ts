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
  BIG_SWAPS_VOLUME = 'BIG_SWAPS_VOLUME',
}

const Color = {
  light: { buys: '#00eeee', sells: '#ff2e22' },
}

export function toChartData(stats: VolumeStats, { type, sort }: ChartInfo): ChartData {
  let entries: ChartEntry[] = []
  switch (type) {
    case VolumeChartDataType.VOLUME:
      const totalBuys = stats.dfiVolume
        .map((i) => new BigNumber(i.totalBuying))
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      const totalSells = stats.dfiVolume
        .map((i) => new BigNumber(i.totalSelling))
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      entries.push(
        ...stats.dfiVolume.map((i) => ({
          label: `bought with ${i.symbol}`,
          data: i.totalBuying,
          color: colorBasedOn(i.symbol),
        })),
      )
      entries.push({
        label: '',
        data: totalBuys.minus(totalSells).abs().decimalPlaces(2).toNumber(),
        color: '#111',
      })
      entries.push(
        ...stats.dfiVolume
          .map((i) => ({ label: `sold to ${i.symbol}`, data: i.totalSelling, color: colorBasedOn(i.symbol) }))
          .reverse(),
      )
      break
    case VolumeChartDataType.BIG_SWAPS_VOLUME:
      const totalBuysBig = stats.dfiVolume
        .map((i) => new BigNumber(i.buyingFromBigSwaps))
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      const totalSellsBig = stats.dfiVolume
        .map((i) => new BigNumber(i.sellingFromBigSwaps))
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
      entries.push(
        ...stats.dfiVolume.map((i) => ({
          label: `bought with ${i.symbol}`,
          data: i.buyingFromBigSwaps,
          color: colorBasedOn(i.symbol),
        })),
      )
      entries.push({
        label: '',
        data: totalBuysBig.minus(totalSellsBig).abs().decimalPlaces(2).toNumber(),
        color: '#111',
      })
      entries.push(
        ...stats.dfiVolume
          .map((i) => ({ label: `sold to ${i.symbol}`, data: i.sellingFromBigSwaps, color: colorBasedOn(i.symbol) }))
          .reverse(),
      )
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

export function toLineChartData(history: VolumeStats[], { type, timeFrame }: LineChartInfo): ChartData {
  const entries: LineChartEntry[] = []

  switch (type) {
    case VolumeChartDataType.VOLUME:
      entries.push({
        label: 'Buys',
        data: history.map((day) => {
          const totalBuys = day.dfiVolume
            .map((i) => new BigNumber(i.totalBuying))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalBuys).decimalPlaces(2).toNumber()
        }),
        color: Color.light.buys,
      })
      entries.push({
        label: 'Sells',
        data: history.map((day) => {
          const totalSells = day.dfiVolume
            .map((i) => new BigNumber(-i.totalSelling))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalSells).decimalPlaces(2).toNumber()
        }),
        color: Color.light.sells,
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
      break
    case VolumeChartDataType.BIG_SWAPS_VOLUME:
      entries.push({
        label: 'Buys',
        data: history.map((day) => {
          const totalBuys = day.dfiVolume
            .map((i) => new BigNumber(i.buyingFromBigSwaps))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalBuys).decimalPlaces(2).toNumber()
        }),
        color: Color.light.buys,
      })
      entries.push({
        label: 'Sells',
        data: history.map((day) => {
          const totalSells = day.dfiVolume
            .map((i) => new BigNumber(-i.sellingFromBigSwaps))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalSells).decimalPlaces(2).toNumber()
        }),
        color: Color.light.sells,
      })
      entries.push({
        label: 'Delta',
        data: history.map((day) => {
          const totalBuys = day.dfiVolume
            .map((i) => new BigNumber(i.buyingFromBigSwaps))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          const totalSells = day.dfiVolume
            .map((i) => new BigNumber(i.sellingFromBigSwaps))
            .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
          return new BigNumber(totalBuys).minus(totalSells).decimalPlaces(2).toNumber()
        }),
        color: '#fff',
      })
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
