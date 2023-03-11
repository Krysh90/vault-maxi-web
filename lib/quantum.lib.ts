import BigNumber from 'bignumber.js'
import moment from 'moment'
import { ChartData } from '../dtos/chart-data.dto'
import { QuantumStats } from '../dtos/quantum-stats.dto'
import { ChartEntry, ChartInfo, getDates, LineChartEntry, LineChartInfo, valueOfTimeFrame } from './chart.lib'
import { colorBasedOn } from './colors.lib'

export enum QuantumChartDataType {
  IN = 'IN',
  OUT = 'OUT',
  LIQUIDITY = 'LIQUIDITY',
  LIQUIDITY_COINS = 'LIQUIDITY COINS',
  NUMBER_OF_TXS = 'NUMBER OF TXS',
  COINS_IN = 'COINS IN',
  COINS_OUT = 'COUNS OUT',
  VOLUME_IN = 'VOLUME IN',
  VOLUME_OUT = 'VOLUME OUT',
  VOLUME_IN_VS_OUT = 'VOLUME IN VS OUT',
  MAX_IN_SWAP = 'MAX IN SWAP',
  MAX_OUT_SWAP = 'MAX OUT SWAP',
}

export function historyDaysToLoad(): string[] {
  return getDates('2023-03-09').map((date) => date.toISOString().slice(0, 10))
}

export function getAllSymbols(stats: QuantumStats): string[] {
  return stats.liquidity.hotwallet ? Object.keys(stats.liquidity.hotwallet) : []
}

export const listOfCryptos = ['DFI', 'BTC', 'ETH', 'LTC', 'BCH', 'DOGE', 'USDT', 'USDC']

export function toChartData(stats: QuantumStats, { type, sort }: ChartInfo): ChartData {
  let entries: ChartEntry[] = []
  switch (type) {
    case QuantumChartDataType.LIQUIDITY:
      entries = stats.liquidity.hotwallet
        ? Object.keys(stats.liquidity.hotwallet).map((token) => ({
            label: token,
            data: new BigNumber(stats.liquidity.hotwallet![token].amount)
              .multipliedBy(stats.liquidity.hotwallet![token].oraclePrice)
              .toNumber(),
            color: colorBasedOn(token),
          }))
        : []
      break
    case QuantumChartDataType.IN:
      entries = stats.txsInBlocks[2880]
        .filter((txStats) => +txStats.coinsIn > 0)
        .map((txStats) => ({
          label: txStats.tokenName,
          data: new BigNumber(txStats.coinsIn).multipliedBy(txStats.oraclePrice).toNumber(),
          color: colorBasedOn(txStats.tokenName),
        }))
      break
    case QuantumChartDataType.OUT:
      entries = stats.txsInBlocks[2880]
        .filter((txStats) => +txStats.coinsOut > 0)
        .map((txStats) => ({
          label: txStats.tokenName,
          data: new BigNumber(txStats.coinsOut).multipliedBy(txStats.oraclePrice).toNumber(),
          color: colorBasedOn(txStats.tokenName),
        }))
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

export function toLineChartData(history: QuantumStats[], { type, timeFrame }: LineChartInfo): ChartData {
  const entries: LineChartEntry[] = []
  const tokens = history[history.length - 1].txsInBlocks[86400].map((txStats) => txStats.tokenName)
  switch (type) {
    case QuantumChartDataType.NUMBER_OF_TXS:
      entries.push({
        label: 'to ETH',
        data: history.map((entry) =>
          entry.txsInBlocks[2880].map((txStats) => txStats.txsIn).reduce((prev, curr) => prev + curr, 0),
        ),
        color: colorBasedOn('ETH'),
      })
      entries.push({
        label: 'to defichain',
        data: history.map((entry) =>
          entry.txsInBlocks[2880].map((txStats) => txStats.txsOut).reduce((prev, curr) => prev + curr, 0),
        ),
        color: colorBasedOn('DFI'),
      })
      break
    case QuantumChartDataType.LIQUIDITY:
      entries.push(
        ...tokens.map((token) => ({
          label: token,
          data: history
            .filter((entry) => entry.liquidity.hotwallet !== undefined)
            .map((entry) =>
              new BigNumber(entry.liquidity.hotwallet![token].amount)
                .multipliedBy(entry.liquidity.hotwallet![token].oraclePrice)
                .toNumber(),
            ),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.LIQUIDITY_COINS:
      entries.push(
        ...tokens.map((token) => ({
          label: token,
          data: history
            .filter((entry) => entry.liquidity.hotwallet !== undefined)
            .map((entry) => new BigNumber(entry.liquidity.hotwallet![token].amount).toNumber()),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.MAX_IN_SWAP:
    case QuantumChartDataType.MAX_OUT_SWAP:
      entries.push(
        ...tokens.map((token) => ({
          label: token,
          data: history.map((entry) =>
            entry.txsInBlocks[2880]
              .filter((txStats) => txStats.tokenName === token)
              .map((txStats) => +(type === QuantumChartDataType.MAX_IN_SWAP ? txStats.maxIn : txStats.maxOut))
              .reduce((prev, curr) => prev + curr, 0),
          ),
          color: colorBasedOn(token),
        })),
      )
      console.log(entries)
      break
    case QuantumChartDataType.VOLUME_IN:
    case QuantumChartDataType.VOLUME_OUT:
      entries.push(
        ...tokens.map((token) => ({
          label: token,
          data: history.map((entry) =>
            entry.txsInBlocks[2880]
              .filter((txStats) => txStats.tokenName === token)
              .map((txStats) =>
                new BigNumber(type === QuantumChartDataType.VOLUME_IN ? txStats.coinsIn : txStats.coinsOut)
                  .multipliedBy(txStats.oraclePrice)
                  .toNumber(),
              )
              .reduce((prev, curr) => prev + curr, 0),
          ),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.VOLUME_IN_VS_OUT:
      entries.push({
        label: 'to ETH',
        data: history.map((entry) =>
          entry.txsInBlocks[2880]
            .map((txStats) => new BigNumber(txStats.coinsIn).multipliedBy(txStats.oraclePrice).toNumber())
            .reduce((prev, curr) => prev + curr, 0),
        ),
        color: colorBasedOn('ETH'),
      })
      entries.push({
        label: 'to defichain',
        data: history.map((entry) =>
          entry.txsInBlocks[2880]
            .map((txStats) => new BigNumber(txStats.coinsOut).multipliedBy(txStats.oraclePrice).toNumber())
            .reduce((prev, curr) => prev + curr, 0),
        ),
        color: colorBasedOn('DFI'),
      })
      break
    case QuantumChartDataType.COINS_IN:
    case QuantumChartDataType.COINS_OUT:
      entries.push(
        ...tokens.map((token) => ({
          label: token,
          data: history.map((entry) =>
            entry.txsInBlocks[2880]
              .filter((txStats) => txStats.tokenName === token)
              .map((txStats) =>
                new BigNumber(type === QuantumChartDataType.COINS_IN ? txStats.coinsIn : txStats.coinsOut).toNumber(),
              )
              .reduce((prev, curr) => prev + curr, 0),
          ),
          color: colorBasedOn(token),
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
