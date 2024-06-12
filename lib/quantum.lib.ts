import BigNumber from 'bignumber.js'
import moment from 'moment'
import { ChartData } from '../dtos/chart-data.dto'
import { QuantumStats } from '../dtos/quantum-stats.dto'
import {
  ChartEntry,
  ChartInfo,
  filterDates,
  getDates,
  LineChartEntry,
  LineChartInfo,
  scanByTimeFrame,
} from './chart.lib'
import { colorBasedOn } from './colors.lib'

export enum QuantumChartDataType {
  LIQUIDITY = 'LIQUIDITY',
  VOLUME_ETH = 'VOLUME ETH',
  VOLUME_DFC = 'VOLUME DFC',
  LIQUIDITY_ETH = 'LIQUIDITY ETH',
  LIQUIDITY_DFC = 'LIQUIDITY DFC',
  QUANTUM_LIQUIDITY = 'QUANTUM LIQUIDITY',
  QUANTUM_VOLUME_ETH = 'QUANTUM VOLUME ETH',
  QUANTUM_VOLUME_DFC = 'QUANTUM VOLUME DFC',
  QUANTUM_LIQUIDITY_ETH = 'QUANTUM LIQUIDITY ETH',
  QUANTUM_LIQUIDITY_DFC = 'QUANTUM LIQUIDITY DFC',
  QUANTUM_TOTAL_VOLUME_ETH = 'QUANTUM TOTAL VOLUME ETH',
  QUANTUM_TOTAL_VOLUME_DFC = 'QUANTUM TOTAL VOLUME DFC',
}

export function historyDaysToLoad(): string[] {
  return filterDates(getDates('2023-04-16')).map((date) => date.toISOString().slice(0, 10))
}

export function getAllSymbols(stats: QuantumStats): string[] {
  return Object.keys(stats.liquidity.defichain)
}

export const listOfCryptos = ['DFI', 'BTC', 'ETH', 'LTC', 'BCH', 'DOGE', 'USDT', 'USDC', 'EUROC']

function getPriceOf(symbol: string, stats: QuantumStats): BigNumber {
  return new BigNumber(stats.prices[symbol] ?? 0)
}

function totalAmountOfLiquidity(liquidity: { token: string; amount: string }[], stats: QuantumStats): BigNumber {
  return liquidity
    .map((entry) => new BigNumber(entry.amount).multipliedBy(getPriceOf(entry.token, stats)))
    .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
    .decimalPlaces(2)
}

export function toChartData(stats: QuantumStats, { type, sort }: ChartInfo): ChartData {
  let entries: ChartEntry[] = []
  switch (type) {
    case QuantumChartDataType.LIQUIDITY:
      const defichain = Object.entries(stats.liquidity.defichain)
        .map(([token, amount]) => ({ token, amount }))
        .sort((a, b) => a.token.localeCompare(b.token))
      const ethereum = Object.entries(stats.liquidity.ethereum)
        .map(([token, amount]) => ({ token, amount }))
        .sort((a, b) => b.token.localeCompare(a.token))
      entries = defichain.map((entry) => ({
        label: entry.token + ' on defichain',
        data: new BigNumber(entry.amount).multipliedBy(getPriceOf(entry.token, stats)).toNumber(),
        color: colorBasedOn(entry.token),
      }))
      entries.push({
        label: '',
        data: totalAmountOfLiquidity(defichain, stats)
          .minus(totalAmountOfLiquidity(ethereum, stats))
          .absoluteValue()
          .toNumber(),
        color: '#111',
      })
      entries = entries.concat(
        ...ethereum.map((entry) => ({
          label: entry.token + ' on Ethereum',
          data: new BigNumber(entry.amount).multipliedBy(getPriceOf(entry.token, stats)).toNumber(),
          color: colorBasedOn(entry.token),
        })),
      )
      break
    case QuantumChartDataType.VOLUME_ETH:
      entries = stats.txs
        .filter((quantumTx) => quantumTx.txsToEthereum > 0)
        .map((entry) => ({
          label: entry.tokenName,
          data: new BigNumber(entry.coinsToEthereum).multipliedBy(getPriceOf(entry.tokenName, stats)).toNumber(),
          color: colorBasedOn(entry.tokenName),
        }))
      break
    case QuantumChartDataType.VOLUME_DFC:
      entries = stats.txs
        .filter((quantumTx) => quantumTx.txsToDefichain > 0)
        .map((entry) => ({
          label: entry.tokenName,
          data: new BigNumber(entry.coinsToDefichain).multipliedBy(getPriceOf(entry.tokenName, stats)).toNumber(),
          color: colorBasedOn(entry.tokenName),
        }))
      break
    case QuantumChartDataType.QUANTUM_LIQUIDITY:
      const quantumDefichain = Object.entries(stats.quantumData.liqDfc)
        .map(([token, amount]) => ({ token, amount }))
        .sort((a, b) => a.token.localeCompare(b.token))
      const quantumEthereum = Object.entries(stats.quantumData.liqEth)
        .map(([token, amount]) => ({ token, amount }))
        .sort((a, b) => b.token.localeCompare(a.token))
      entries = quantumDefichain.map((entry) => ({
        label: entry.token + ' on defichain',
        data: new BigNumber(entry.amount).multipliedBy(getPriceOf(entry.token, stats)).toNumber(),
        color: colorBasedOn(entry.token),
      }))
      entries.push({
        label: '',
        data: totalAmountOfLiquidity(quantumDefichain, stats)
          .minus(totalAmountOfLiquidity(quantumEthereum, stats))
          .absoluteValue()
          .toNumber(),
        color: '#111',
      })
      entries = entries.concat(
        ...quantumEthereum.map((entry) => ({
          label: entry.token + ' on Ethereum',
          data: new BigNumber(entry.amount).multipliedBy(getPriceOf(entry.token, stats)).toNumber(),
          color: colorBasedOn(entry.token),
        })),
      )
      break
    case QuantumChartDataType.QUANTUM_VOLUME_ETH:
      entries = Object.entries(stats.quantumData.txsToEth.amountBridged)
        .map(([token, amount]) => ({ token, amount }))
        .filter((entry) => new BigNumber(entry.amount).isGreaterThan(0))
        .map((entry) => ({
          label: entry.token,
          data: new BigNumber(entry.amount).multipliedBy(getPriceOf(entry.token, stats)).toNumber(),
          color: colorBasedOn(entry.token),
        }))
      break
    case QuantumChartDataType.QUANTUM_VOLUME_DFC:
      entries = Object.entries(stats.quantumData.txsToDfc.amountBridged)
        .map(([token, amount]) => ({ token, amount }))
        .filter((entry) => new BigNumber(entry.amount).isGreaterThan(0))
        .map((entry) => ({
          label: entry.token,
          data: new BigNumber(entry.amount).multipliedBy(getPriceOf(entry.token, stats)).toNumber(),
          color: colorBasedOn(entry.token),
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
  const defichainTokens = Object.keys(history.slice(-1)[0].liquidity.defichain)
  const ethereumTokens = Object.keys(history.slice(-1)[0].liquidity.ethereum)
  const quantumDfcTokens = Object.keys(history.slice(-1)[0].quantumData.liqDfc)
  const quantumEthTokens = Object.keys(history.slice(-1)[0].quantumData.liqEth)
  const historyToCheck = scanByTimeFrame(history, timeFrame)
  switch (type) {
    case QuantumChartDataType.LIQUIDITY_DFC:
      entries.push(
        ...defichainTokens.map((token) => ({
          label: token,
          data: historyToCheck
            .filter((entry) => entry.liquidity.defichain !== undefined && entry.liquidity.defichain[token])
            .map((entry) =>
              new BigNumber(entry.liquidity.defichain[token]).multipliedBy(getPriceOf(token, entry)).toNumber(),
            ),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.LIQUIDITY_ETH:
      entries.push(
        ...ethereumTokens.map((token) => ({
          label: token,
          data: historyToCheck
            .filter((entry) => entry.liquidity.ethereum !== undefined && entry.liquidity.ethereum[token])
            .map((entry) =>
              new BigNumber(entry.liquidity.ethereum[token]).multipliedBy(getPriceOf(token, entry)).toNumber(),
            ),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.VOLUME_DFC:
      entries.push(
        ...defichainTokens.map((token) => ({
          label: token,
          data: historyToCheck.map((entry) => {
            const tokenTxs = entry.txs.find(
              (quantumTx) => quantumTx.tokenName === token && quantumTx.txsToDefichain > 0,
            )
            return tokenTxs
              ? new BigNumber(tokenTxs?.coinsToDefichain).multipliedBy(getPriceOf(token, entry)).toNumber()
              : 0
          }),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.VOLUME_ETH:
      entries.push(
        ...ethereumTokens.map((token) => ({
          label: token,
          data: historyToCheck.map((entry) => {
            const tokenTxs = entry.txs.find((quantumTx) => quantumTx.tokenName === token && quantumTx.txsToEthereum > 0)
            return tokenTxs
              ? new BigNumber(tokenTxs?.coinsToEthereum).multipliedBy(getPriceOf(token, entry)).toNumber()
              : 0
          }),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.QUANTUM_LIQUIDITY_DFC:
      entries.push(
        ...quantumDfcTokens.map((token) => ({
          label: token,
          data: historyToCheck
            .filter((entry) => entry.quantumData.liqDfc !== undefined && entry.quantumData.liqDfc[token])
            .map((entry) =>
              new BigNumber(entry.quantumData.liqDfc[token]).multipliedBy(getPriceOf(token, entry)).toNumber(),
            ),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.QUANTUM_LIQUIDITY_ETH:
      entries.push(
        ...quantumEthTokens.map((token) => ({
          label: token,
          data: historyToCheck
            .filter((entry) => entry.quantumData.liqEth !== undefined && entry.quantumData.liqEth[token])
            .map((entry) =>
              new BigNumber(entry.quantumData.liqEth[token]).multipliedBy(getPriceOf(token, entry)).toNumber(),
            ),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.QUANTUM_VOLUME_DFC:
      entries.push(
        ...quantumDfcTokens.map((token) => ({
          label: token,
          data: historyToCheck
            .filter(
              (entry) =>
                entry.quantumData.txsToDfc.amountBridged !== undefined &&
                entry.quantumData.txsToDfc.amountBridged[token],
            )
            .map((entry) =>
              new BigNumber(entry.quantumData.txsToDfc.amountBridged[token])
                .multipliedBy(getPriceOf(token, entry))
                .toNumber(),
            ),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.QUANTUM_VOLUME_ETH:
      entries.push(
        ...quantumEthTokens.map((token) => ({
          label: token,
          data: historyToCheck
            .filter(
              (entry) =>
                entry.quantumData.txsToEth.amountBridged !== undefined &&
                entry.quantumData.txsToEth.amountBridged[token],
            )
            .map((entry) =>
              new BigNumber(entry.quantumData.txsToEth.amountBridged[token])
                .multipliedBy(getPriceOf(token, entry))
                .toNumber(),
            ),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.QUANTUM_TOTAL_VOLUME_DFC:
      entries.push(
        ...quantumDfcTokens.map((token) => ({
          label: token,
          data: historyToCheck
            .filter(
              (entry) =>
                entry.quantumData.txsToDfc.totalBridgedAmount !== undefined &&
                entry.quantumData.txsToDfc.totalBridgedAmount[token],
            )
            .map((entry) =>
              new BigNumber(entry.quantumData.txsToDfc.totalBridgedAmount[token])
                .multipliedBy(getPriceOf(token, entry))
                .toNumber(),
            ),
          color: colorBasedOn(token),
        })),
      )
      break
    case QuantumChartDataType.QUANTUM_TOTAL_VOLUME_ETH:
      entries.push(
        ...quantumEthTokens.map((token) => ({
          label: token,
          data: historyToCheck
            .filter(
              (entry) =>
                entry.quantumData.txsToEth.totalBridgedAmount !== undefined &&
                entry.quantumData.txsToEth.totalBridgedAmount[token],
            )
            .map((entry) =>
              new BigNumber(entry.quantumData.txsToEth.totalBridgedAmount[token])
                .multipliedBy(getPriceOf(token, entry))
                .toNumber(),
            ),
          color: colorBasedOn(token),
        })),
      )
      break
  }

  return {
    labels: historyToCheck.map((entry) => moment(entry.meta.tstamp).utc().format('DD-MM-YYYY')),
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
  return undefined
}
