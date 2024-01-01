import BigNumber from 'bignumber.js'
import { ChartData } from '../dtos/chart-data.dto'
import { DTokenStats, DTokenStatsEntry } from '../dtos/dtoken-stats.dto'
import {
  ChartEntry,
  ChartInfo,
  LineChartInfo,
  getDates,
  LineChartEntry,
  valueOfTimeFrame,
  filterDates,
} from './chart.lib'
import { colorBasedOn } from './colors.lib'
import moment from 'moment'

export enum DTokenStatsChartDataType {
  DISTRIBUTION = 'DISTRIBUTION',
  FUTURESWAP = 'FUTURESWAP',
  ALGO = 'ALGO',
  BACKED = 'BACKED',
  RATIO = 'RATIO',
}

export enum DUSDStatsChartDataType {
  VOLUME = 'VOLUME',
  CIRCULATING_SUPPLY = 'CIRCULATING SUPPLY',
  DISTRIBUTION = 'DUSD DISTRIBUTION',
}

export function historyDaysToLoad(): string[] {
  return filterDates(getDates('2023-01-02')).map((date) => date.toISOString().slice(0, 10))
}

function calculateAlgoTokens(entry?: DTokenStatsEntry): number {
  if (!entry) return 0
  return entry.minted.chainReported - entry.minted.loans - entry.openinterest - entry.burn.futureswap - entry.burn.other
}

export function toChartData(stats: DTokenStats, { type, sort }: ChartInfo): ChartData {
  let entries: ChartEntry[] = []
  switch (type) {
    case DTokenStatsChartDataType.DISTRIBUTION: {
      const dUSD = stats.dTokens.find((entry) => entry.key === 'DUSD')
      const algoDUSD = calculateAlgoTokens(dUSD)
      const backedDUSD = (dUSD?.minted.loans ?? 0) + (dUSD?.openinterest ?? 0)
      const algoEverythingElse = stats.dTokens
        .filter((entry) => entry.key !== 'DUSD')
        .map((entry) => calculateAlgoTokens(entry) * entry.price)
        .reduce((prev, curr) => prev + curr, 0)
      const backedEverythingElse = stats.dTokens
        .filter((entry) => entry.key !== 'DUSD')
        .map((entry) => (entry.minted.loans + entry.openinterest) * entry.price)
        .reduce((prev, curr) => prev + curr, 0)
      entries.push({
        label: 'algo DUSD',
        data: algoDUSD,
        color: colorBasedOn('DUSD'),
      })
      entries.push({
        label: 'algo dToken',
        data: algoEverythingElse,
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: '',
        data: Math.abs(algoDUSD + algoEverythingElse - (backedDUSD + backedEverythingElse)),
        color: '#111',
      })
      entries.push({
        label: 'backed dToken',
        data: backedEverythingElse,
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: 'backed DUSD',
        data: backedDUSD,
        color: colorBasedOn('DUSD'),
      })
      break
    }
    case DTokenStatsChartDataType.FUTURESWAP:
      const dUSD = stats.dTokens.find((entry) => entry.key === 'DUSD')
      const everythingElse = stats.dTokens.filter((entry) => entry.key !== 'DUSD')
      entries.push({
        label: 'Minted dUSD',
        data: dUSD?.minted.futureswap ?? 0,
        color: Color.light.mint,
      })
      entries.push({
        label: 'Minted dToken',
        data: everythingElse
          .map((entry) => entry.minted.futureswap * entry.price)
          .reduce((prev, curr) => prev + curr, 0),
        color: Color.dark.mint,
      })
      entries.push({
        label: 'Burned dUSD',
        data: dUSD?.burn.futureswap ?? 0,
        color: Color.light.burn,
      })
      entries.push({
        label: 'Burned dToken',
        data: everythingElse.map((entry) => entry.burn.futureswap * entry.price).reduce((prev, curr) => prev + curr, 0),
        color: Color.dark.burn,
      })
      break
    case DUSDStatsChartDataType.VOLUME:
      entries.push({
        label: 'Organic buys',
        data: new BigNumber(stats.dusdVolume.organic.buying).decimalPlaces(2).toNumber(),
        color: Color.light.mint,
      })
      entries.push({
        label: 'Automated buys',
        data: new BigNumber(stats.dusdVolume.bots.buying).decimalPlaces(2).toNumber(),
        color: Color.dark.mint,
      })
      entries.push({
        label: '',
        data: new BigNumber(stats.dusdVolume.organic.buying)
          .plus(stats.dusdVolume.bots.buying)
          .minus(stats.dusdVolume.organic.selling)
          .minus(stats.dusdVolume.bots.selling)
          .abs()
          .decimalPlaces(2)
          .toNumber(),
        color: '#111',
      })
      entries.push({
        label: 'Automated sells',
        data: new BigNumber(stats.dusdVolume.bots.selling).decimalPlaces(2).toNumber(),
        color: Color.dark.burn,
      })
      entries.push({
        label: 'Organic sells',
        data: new BigNumber(stats.dusdVolume.organic.selling).decimalPlaces(2).toNumber(),
        color: Color.light.burn,
      })
      break
    case DUSDStatsChartDataType.CIRCULATING_SUPPLY: {
      const dUSD = stats.dTokens.find((entry) => entry.key === 'DUSD')
      const algoDUSD = calculateAlgoTokens(dUSD)
      const backedDUSD = (dUSD?.minted.loans ?? 0) + (dUSD?.openinterest ?? 0)
      entries.push({
        label: 'backed DUSD',
        data: backedDUSD,
        color: colorBasedOn('DUSD'),
      })
      entries.push({
        label: 'algo DUSD',
        data: algoDUSD,
        color: colorBasedOn('dToken'),
      })
      break
    }
    case DUSDStatsChartDataType.DISTRIBUTION: {
      entries.push({
        label: 'Collateral',
        data: new BigNumber(stats.dusdDistribution.collateral).plus(stats.dusdDistribution.stakeXLoop).toNumber(),
        color: Color.collateral,
      })
      entries.push({
        label: 'StakeX TVL',
        data: new BigNumber(stats.dusdDistribution.stakeXTVL).toNumber(),
        color: Color.stakeX,
      })
      entries.push({
        label: 'Gateway pools',
        data: new BigNumber(stats.dusdDistribution.gatewayPools).toNumber(),
        color: Color.gatewayPools,
      })
      entries.push({
        label: 'dToken pools',
        data: new BigNumber(stats.dusdDistribution.dTokenPools).toNumber(),
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: 'YieldVault addresses',
        data: new BigNumber(stats.dusdDistribution.yieldVault).toNumber(),
        color: Color.yieldVault,
      })
      entries.push({
        label: 'Free (approx.)',
        data: new BigNumber(stats.dusdDistribution.free).toNumber(),
        color: colorBasedOn('DUSD'),
      })
      break
    }
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
  light: { mint: '#00eeee', burn: '#ff2e22' },
  dark: { mint: '#00aaaa', burn: '#cc241b' },
  collateral: '#0dacde',
  gatewayPools: '#cd0c60',
  yieldVault: '#6a5df2',
  stakeX: '#76ff03',
  stakeXLoop: '#00d0e8',
}

function getHistoryToCheck(history: DTokenStats[], type: string): DTokenStats[] {
  if (type === DUSDStatsChartDataType.VOLUME) return history
  else if (type === DUSDStatsChartDataType.DISTRIBUTION) return history.slice((getDates('2023-10-04').length - 1) * -1)
  else return history.slice((getDates('2023-05-24').length - 1) * -1)
}

export function toLineChartData(history: DTokenStats[], { type, timeFrame }: LineChartInfo): ChartData {
  const historyToCheck = getHistoryToCheck(history, type)
  const entries: LineChartEntry[] = []
  switch (type) {
    case DUSDStatsChartDataType.CIRCULATING_SUPPLY:
      entries.push({
        label: 'Algo DUSD',
        data: historyToCheck.map((day) => calculateAlgoTokens(day.dTokens.find((entry) => entry.key === 'DUSD'))),
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: 'Backed DUSD',
        data: historyToCheck.map(
          (day) =>
            (day.dTokens.find((entry) => entry.key === 'DUSD')?.minted.loans ?? 0) +
            (day.dTokens.find((entry) => entry.key === 'DUSD')?.openinterest ?? 0),
        ),
        color: colorBasedOn('DUSD'),
      })
      entries.push({
        label: 'Total DUSD',
        data: historyToCheck.map(
          (day) =>
            calculateAlgoTokens(day.dTokens.find((entry) => entry.key === 'DUSD')) +
            (day.dTokens.find((entry) => entry.key === 'DUSD')?.minted.loans ?? 0) +
            (day.dTokens.find((entry) => entry.key === 'DUSD')?.openinterest ?? 0),
        ),
        color: '#fff',
      })
      break
    case DTokenStatsChartDataType.ALGO:
      entries.push({
        label: 'Algo DUSD',
        data: historyToCheck.map((day) => calculateAlgoTokens(day.dTokens.find((entry) => entry.key === 'DUSD'))),
        color: colorBasedOn('DUSD'),
      })
      entries.push({
        label: 'Algo dToken',
        data: historyToCheck.map((day) =>
          day.dTokens
            .filter((entry) => entry.key !== 'DUSD')
            .map((entry) => calculateAlgoTokens(entry) * entry.price)
            .reduce((prev, curr) => prev + curr, 0),
        ),
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: 'Algo combined',
        data: historyToCheck.map((day) =>
          day.dTokens.map((entry) => calculateAlgoTokens(entry) * entry.price).reduce((prev, curr) => prev + curr, 0),
        ),
        color: '#fff',
      })
      break
    case DTokenStatsChartDataType.BACKED:
      entries.push({
        label: 'Backed DUSD',
        data: historyToCheck.map(
          (day) =>
            (day.dTokens.find((entry) => entry.key === 'DUSD')?.minted.loans ?? 0) +
            (day.dTokens.find((entry) => entry.key === 'DUSD')?.openinterest ?? 0),
        ),
        color: colorBasedOn('DUSD'),
      })
      entries.push({
        label: 'Backed dToken',
        data: historyToCheck.map((day) =>
          day.dTokens
            .filter((entry) => entry.key !== 'DUSD')
            .map((entry) => (entry.minted.loans + entry.openinterest) * entry.price)
            .reduce((prev, curr) => prev + curr, 0),
        ),
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: 'Backed combined',
        data: historyToCheck.map((day) =>
          day.dTokens
            .map((entry) => (entry.minted.loans + entry.openinterest) * entry.price)
            .reduce((prev, curr) => prev + curr, 0),
        ),
        color: '#fff',
      })
      break
    case DTokenStatsChartDataType.RATIO:
      entries.push({
        label: 'DUSD',
        data: historyToCheck.map((day) => {
          const dUSD = day.dTokens.find((entry) => entry.key === 'DUSD')
          const algo = calculateAlgoTokens(dUSD)
          const backed = (dUSD?.minted.loans ?? 0) + (dUSD?.openinterest ?? 0)
          return new BigNumber(algo)
            .dividedBy(algo + backed)
            .multipliedBy(100)
            .decimalPlaces(2)
            .toNumber()
        }),
        color: colorBasedOn('DUSD'),
      })
      entries.push({
        label: 'dToken',
        data: historyToCheck.map((day) => {
          const tokens = day.dTokens.filter((entry) => entry.key !== 'DUSD')
          const algo = tokens
            .map((entry) => calculateAlgoTokens(entry) * entry.price)
            .reduce((prev, curr) => prev + curr, 0)
          const backed = tokens
            .map((entry) => (entry.minted.loans + entry.openinterest) * entry.price)
            .reduce((prev, curr) => prev + curr, 0)
          return new BigNumber(algo)
            .dividedBy(algo + backed)
            .multipliedBy(100)
            .decimalPlaces(2)
            .toNumber()
        }),
        color: colorBasedOn('dToken'),
      })

      entries.push({
        label: 'Combined',
        data: historyToCheck.map((day) => {
          const algo = day.dTokens
            .map((entry) => calculateAlgoTokens(entry) * entry.price)
            .reduce((prev, curr) => prev + curr, 0)
          const backed = day.dTokens
            .map((entry) => (entry.minted.loans + entry.openinterest) * entry.price)
            .reduce((prev, curr) => prev + curr, 0)
          return new BigNumber(algo)
            .dividedBy(algo + backed)
            .multipliedBy(100)
            .decimalPlaces(2)
            .toNumber()
        }),
        color: '#fff',
      })
      break
    case DTokenStatsChartDataType.FUTURESWAP:
      entries.push({
        label: 'Minted DUSD',
        data: historyToCheck.map((day) => day.dTokens.find((entry) => entry.key === 'DUSD')?.minted.futureswap ?? 0),
        color: Color.light.mint,
      })
      entries.push({
        label: 'Minted dToken',
        data: historyToCheck.map((day) =>
          day.dTokens
            .filter((entry) => entry.key !== 'DUSD')
            .map((entry) => entry.minted.futureswap * entry.price)
            .reduce((prev, curr) => prev + curr, 0),
        ),
        color: Color.dark.mint,
      })
      entries.push({
        label: 'Burned DUSD',
        data: historyToCheck.map((day) => day.dTokens.find((entry) => entry.key === 'DUSD')?.burn.futureswap ?? 0),
        color: Color.light.burn,
      })
      entries.push({
        label: 'Burned dToken',
        data: historyToCheck.map((day) =>
          day.dTokens
            .filter((entry) => entry.key !== 'DUSD')
            .map((entry) => entry.burn.futureswap * entry.price)
            .reduce((prev, curr) => prev + curr, 0),
        ),
        color: Color.dark.burn,
      })
      entries.push({
        label: 'Delta',
        data: historyToCheck.map((day) => {
          const dUSD = day.dTokens.find((entry) => entry.key === 'DUSD')
          const everythingElseMinted = day.dTokens
            .filter((entry) => entry.key !== 'DUSD')
            .map((entry) => entry.minted.futureswap * entry.price)
            .reduce((prev, curr) => prev + curr, 0)
          const everythingElseBurned = day.dTokens
            .filter((entry) => entry.key !== 'DUSD')
            .map((entry) => entry.burn.futureswap * entry.price)
            .reduce((prev, curr) => prev + curr, 0)
          return (
            (dUSD?.minted.futureswap ?? 0) + everythingElseMinted - (dUSD?.burn.futureswap ?? 0) - everythingElseBurned
          )
        }),
        color: '#fff',
      })
      break
    case DUSDStatsChartDataType.VOLUME:
      entries.push({
        label: 'Organic buys',
        data:
          historyToCheck?.map((day) => new BigNumber(day.dusdVolume.organic.buying).decimalPlaces(2).toNumber()) ?? [],
        color: Color.light.mint,
      })
      entries.push({
        label: 'Automated buys',
        data: historyToCheck?.map((day) => new BigNumber(day.dusdVolume.bots.buying).decimalPlaces(2).toNumber()) ?? [],
        color: Color.dark.mint,
      })
      entries.push({
        label: 'Organic sells',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(day.dusdVolume.organic.selling).negated().decimalPlaces(2).toNumber(),
          ) ?? [],
        color: Color.light.burn,
      })
      entries.push({
        label: 'Automated sells',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(day.dusdVolume.bots.selling).negated().decimalPlaces(2).toNumber(),
          ) ?? [],
        color: Color.dark.burn,
      })
      entries.push({
        label: 'Delta',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(day.dusdVolume.organic.buying)
              .plus(day.dusdVolume.bots.buying)
              .minus(day.dusdVolume.organic.selling)
              .minus(day.dusdVolume.bots.selling)
              .decimalPlaces(2)
              .toNumber(),
          ) ?? [],
        color: '#fff',
      })
      entries.push({
        label: 'Delta organic',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(day.dusdVolume.organic.buying)
              .minus(day.dusdVolume.organic.selling)
              .decimalPlaces(2)
              .toNumber(),
          ) ?? [],
        color: '#999',
      })
      break
    case DUSDStatsChartDataType.DISTRIBUTION:
      entries.push({
        label: 'Collateral',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(day.dusdDistribution?.collateral).plus(day.dusdDistribution?.stakeXLoop).toNumber(),
          ) ?? [],
        color: Color.collateral,
      })
      entries.push({
        label: 'StakeX TVL',
        data: historyToCheck?.map((day) => new BigNumber(day.dusdDistribution?.stakeXTVL).toNumber()) ?? [],
        color: Color.stakeX,
      })
      entries.push({
        label: 'Gateway pools',
        data: historyToCheck?.map((day) => new BigNumber(day.dusdDistribution?.gatewayPools).toNumber()) ?? [],
        color: Color.gatewayPools,
      })
      entries.push({
        label: 'dToken pools',
        data: historyToCheck?.map((day) => new BigNumber(day.dusdDistribution?.dTokenPools).toNumber()) ?? [],
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: 'YieldVault addresses',
        data: historyToCheck?.map((day) => new BigNumber(day.dusdDistribution?.yieldVault).toNumber()) ?? [],
        color: Color.yieldVault,
      })
      entries.push({
        label: 'Free (approx.)',
        data: historyToCheck?.map((day) => new BigNumber(day.dusdDistribution?.free).toNumber()) ?? [],
        color: colorBasedOn('DUSD'),
      })
      break
  }

  return {
    labels: historyToCheck
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
