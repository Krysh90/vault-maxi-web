import BigNumber from 'bignumber.js'
import { ChartData } from '../dtos/chart-data.dto'
import { DTokenStats, DTokenStatsEntry } from '../dtos/dtoken-stats.dto'
import {
  ChartEntry,
  ChartInfo,
  LineChartInfo,
  getDates,
  LineChartEntry,
  filterDates,
  scanByTimeFrame,
  LineChartTimeFrame,
} from './chart.lib'
import { colorBasedOn } from './colors.lib'
import moment from 'moment'

export enum DTokenStatsChartDataType {
  DISTRIBUTION = 'DISTRIBUTION',
  FUTURESWAP = 'FUTURESWAP',
  ALGO = 'ALGO',
  BACKED = 'BACKED',
  RATIO = 'RATIO',
  ALGO_NUMBER = 'ALGO NUMBER',
  ALGO_NUMBER_TO_VALUE = 'ALGO NUMBER TO VALUE',
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
        label: 'Buys',
        data: new BigNumber(stats.dusdVolume.organic.buying)
          .plus(stats.dusdVolume.bots.buying)
          .decimalPlaces(2)
          .toNumber(),
        color: Color.light.mint,
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
        label: 'DEX fee',
        data: new BigNumber(stats.dusdVolume.organic.selling)
          .plus(stats.dusdVolume.bots.selling)
          .multipliedBy(stats.dusdVolume.fee ?? 0.3)
          .decimalPlaces(2)
          .toNumber(),
        color: Color.dark.burn,
      })
      entries.push({
        label: 'Sells (effective)',
        data: new BigNumber(stats.dusdVolume.organic.selling)
          .plus(stats.dusdVolume.bots.selling)
          .multipliedBy(new BigNumber(1).minus(stats.dusdVolume.fee ?? 0.3))
          .decimalPlaces(2)
          .toNumber(),
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
        label: 'DMC',
        data: new BigNumber(stats.dusdDistribution.otherOnDMC).toNumber(),
        color: Color.dmc,
      })
      entries.push({
        label: 'Bond 1Y TVL',
        data: new BigNumber(stats.dusdDistribution.tvlBond1).toNumber(),
        color: Color.bond1Y,
      })
      entries.push({
        label: 'Bond 2Y TVL',
        data: new BigNumber(stats.dusdDistribution.tvlBond2).toNumber(),
        color: Color.bond2Y,
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
      entries.push({
        label: 'Locked',
        data: new BigNumber(stats.dusdDistribution.inLock).toNumber(),
        color: Color.inLock,
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
  bond1Y: '#FDDC5C',
  bond2Y: '#f5bf03',
  dmc: '#0964F4',
  inLock: '#cc008c',
}

function getHistoryToCheck(history: DTokenStats[], type: string): DTokenStats[] {
  return history
  // due to changes on how many history data we will load - this
  // if (type === DUSDStatsChartDataType.VOLUME) return history
  // else if (type === DUSDStatsChartDataType.DISTRIBUTION) return history.slice((getDates('2023-10-04').length - 1) * -1)
  // else return history.slice((getDates('2023-05-24').length - 1) * -1)
}

export function toLineChartData(history: DTokenStats[], { type, timeFrame }: LineChartInfo): ChartData {
  const historyToCheck = scanByTimeFrame(getHistoryToCheck(history, type), timeFrame)
  const entries: LineChartEntry[] = []
  switch (type) {
    case DUSDStatsChartDataType.CIRCULATING_SUPPLY:
      entries.push({
        label: 'Algo DUSD',
        data: historyToCheck.map((day) =>
          calculateAlgoTokens(dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')),
        ),
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: 'Backed DUSD',
        data: historyToCheck.map(
          (day) =>
            (dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')?.minted.loans ??
              0) +
            (dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')?.openinterest ??
              0),
        ),
        color: colorBasedOn('DUSD'),
      })
      entries.push({
        label: 'Total DUSD',
        data: historyToCheck.map(
          (day) =>
            calculateAlgoTokens(
              dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD'),
            ) +
            (dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')?.minted.loans ??
              0) +
            (dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')?.openinterest ??
              0),
        ),
        color: '#fff',
      })
      break
    case DTokenStatsChartDataType.ALGO:
      entries.push({
        label: 'Algo DUSD',
        data: historyToCheck.map((day) =>
          calculateAlgoTokens(dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')),
        ),
        color: colorBasedOn('DUSD'),
      })
      entries.push({
        label: 'Algo dToken',
        data: historyToCheck.map((day) =>
          dayOrAvg(day, timeFrame)
            .dTokens.filter((entry: DTokenStatsEntry) => entry.key !== 'DUSD')
            .map((entry: DTokenStatsEntry) => calculateAlgoTokens(entry) * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0),
        ),
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: 'Algo combined',
        data: historyToCheck.map((day) =>
          dayOrAvg(day, timeFrame)
            .dTokens.map((entry: DTokenStatsEntry) => calculateAlgoTokens(entry) * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0),
        ),
        color: '#fff',
      })
      break
    case DTokenStatsChartDataType.BACKED:
      entries.push({
        label: 'Backed DUSD',
        data: historyToCheck.map(
          (day) =>
            (dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')?.minted.loans ??
              0) +
            (dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')?.openinterest ??
              0),
        ),
        color: colorBasedOn('DUSD'),
      })
      entries.push({
        label: 'Backed dToken',
        data: historyToCheck.map((day) =>
          dayOrAvg(day, timeFrame)
            .dTokens.filter((entry: DTokenStatsEntry) => entry.key !== 'DUSD')
            .map((entry: DTokenStatsEntry) => (entry.minted.loans + entry.openinterest) * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0),
        ),
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: 'Backed combined',
        data: historyToCheck.map((day) =>
          dayOrAvg(day, timeFrame)
            .dTokens.map((entry: DTokenStatsEntry) => (entry.minted.loans + entry.openinterest) * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0),
        ),
        color: '#fff',
      })
      break
    case DTokenStatsChartDataType.RATIO:
      entries.push({
        label: 'DUSD',
        data: historyToCheck.map((day) => {
          const dUSD = dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')
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
          const tokens = dayOrAvg(day, timeFrame).dTokens.filter((entry: DTokenStatsEntry) => entry.key !== 'DUSD')
          const algo = tokens
            .map((entry: DTokenStatsEntry) => calculateAlgoTokens(entry) * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0)
          const backed = tokens
            .map((entry: DTokenStatsEntry) => (entry.minted.loans + entry.openinterest) * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0)
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
          const algo = dayOrAvg(day, timeFrame)
            .dTokens.map((entry: DTokenStatsEntry) => calculateAlgoTokens(entry) * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0)
          const backed = dayOrAvg(day, timeFrame)
            .dTokens.map((entry: DTokenStatsEntry) => (entry.minted.loans + entry.openinterest) * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0)
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
        data: historyToCheck.map(
          (day) =>
            dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')?.minted
              .futureswap ?? 0,
        ),
        color: Color.light.mint,
      })
      entries.push({
        label: 'Minted dToken',
        data: historyToCheck.map((day) =>
          dayOrAvg(day, timeFrame)
            .dTokens.filter((entry: DTokenStatsEntry) => entry.key !== 'DUSD')
            .map((entry: DTokenStatsEntry) => entry.minted.futureswap * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0),
        ),
        color: Color.dark.mint,
      })
      entries.push({
        label: 'Burned DUSD',
        data: historyToCheck.map(
          (day) =>
            dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')?.burn.futureswap ??
            0,
        ),
        color: Color.light.burn,
      })
      entries.push({
        label: 'Burned dToken',
        data: historyToCheck.map((day) =>
          dayOrAvg(day, timeFrame)
            .dTokens.filter((entry: DTokenStatsEntry) => entry.key !== 'DUSD')
            .map((entry: DTokenStatsEntry) => entry.burn.futureswap * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0),
        ),
        color: Color.dark.burn,
      })
      entries.push({
        label: 'Delta',
        data: historyToCheck.map((day) => {
          const dUSD = dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')
          const everythingElseMinted = dayOrAvg(day, timeFrame)
            .dTokens.filter((entry: DTokenStatsEntry) => entry.key !== 'DUSD')
            .map((entry: DTokenStatsEntry) => entry.minted.futureswap * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0)
          const everythingElseBurned = dayOrAvg(day, timeFrame)
            .dTokens.filter((entry: DTokenStatsEntry) => entry.key !== 'DUSD')
            .map((entry: DTokenStatsEntry) => entry.burn.futureswap * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0)
          return (
            (dUSD?.minted.futureswap ?? 0) + everythingElseMinted - (dUSD?.burn.futureswap ?? 0) - everythingElseBurned
          )
        }),
        color: '#fff',
      })
      entries.push({
        label: 'dUSD delta',
        data: historyToCheck.map((day) => {
          const dUSD = dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD')
          return (dUSD?.minted.futureswap ?? 0) - (dUSD?.burn.futureswap ?? 0)
        }),
        color: '#999',
      })
      break
    case DTokenStatsChartDataType.ALGO_NUMBER:
      entries.push({
        label: '# Algo dToken',
        data: historyToCheck.map((day) =>
          dayOrAvg(day, timeFrame)
            .dTokens.filter((entry: DTokenStatsEntry) => entry.key !== 'DUSD')
            .map((entry: DTokenStatsEntry) => calculateAlgoTokens(entry))
            .reduce((prev: number, curr: number) => prev + curr, 0),
        ),
        color: colorBasedOn('dToken'),
      })
      break
    case DTokenStatsChartDataType.ALGO_NUMBER_TO_VALUE:
      entries.push({
        label: 'Ratio',
        data: historyToCheck.map((day) => {
          const dUSD = calculateAlgoTokens(
            dayOrAvg(day, timeFrame).dTokens.find((entry: DTokenStatsEntry) => entry.key === 'DUSD'),
          )
          const dToken = dayOrAvg(day, timeFrame)
            .dTokens.filter((entry: DTokenStatsEntry) => entry.key !== 'DUSD')
            .map((entry: DTokenStatsEntry) => calculateAlgoTokens(entry))
            .reduce((prev: number, curr: number) => prev + curr, 0)
          const dTokenValue = dayOrAvg(day, timeFrame)
            .dTokens.filter((entry: DTokenStatsEntry) => entry.key !== 'DUSD')
            .map((entry: DTokenStatsEntry) => calculateAlgoTokens(entry) * entry.price)
            .reduce((prev: number, curr: number) => prev + curr, 0)
          const numberOfTokens = new BigNumber(dUSD).plus(dToken)
          const valueOfTokens = new BigNumber(dUSD).plus(dTokenValue)
          return numberOfTokens.dividedBy(valueOfTokens).toNumber()
        }),
        color: '#fff',
      })
      break
    case DUSDStatsChartDataType.VOLUME:
      entries.push({
        label: 'Buys',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(dayOrAvg(day, timeFrame).dusdVolume.organic.buying)
              .plus(dayOrAvg(day, timeFrame).dusdVolume.bots.buying)
              .decimalPlaces(2)
              .toNumber(),
          ) ?? [],
        color: Color.light.mint,
      })
      entries.push({
        label: 'Sells (effective)',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(dayOrAvg(day, timeFrame).dusdVolume.organic.selling)
              .plus(dayOrAvg(day, timeFrame).dusdVolume.bots.selling)
              .multipliedBy(new BigNumber(1).minus(dayOrAvg(day, timeFrame).dusdVolume.fee ?? 0.3))
              .negated()
              .decimalPlaces(2)
              .toNumber(),
          ) ?? [],
        color: Color.light.burn,
      })
      entries.push({
        label: 'DEX fee',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(dayOrAvg(day, timeFrame).dusdVolume.organic.selling)
              .plus(dayOrAvg(day, timeFrame).dusdVolume.bots.selling)
              .multipliedBy(dayOrAvg(day, timeFrame).dusdVolume.fee ?? 0.3)
              .negated()
              .decimalPlaces(2)
              .toNumber(),
          ) ?? [],
        color: Color.dark.burn,
      })
      entries.push({
        label: 'Effective delta',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(dayOrAvg(day, timeFrame).dusdVolume.organic.buying)
              .plus(dayOrAvg(day, timeFrame).dusdVolume.bots.buying)
              .minus(
                new BigNumber(dayOrAvg(day, timeFrame).dusdVolume.organic.selling)
                  .plus(dayOrAvg(day, timeFrame).dusdVolume.bots.selling)
                  .multipliedBy(new BigNumber(1).minus(dayOrAvg(day, timeFrame).dusdVolume.fee ?? 0.3)),
              )
              .decimalPlaces(2)
              .toNumber(),
          ) ?? [],
        color: '#fff',
      })
      break
    case DUSDStatsChartDataType.DISTRIBUTION:
      entries.push({
        label: 'Collateral',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(dayOrAvg(day, timeFrame).dusdDistribution?.collateral)
              .plus(dayOrAvg(day, timeFrame).dusdDistribution?.stakeXLoop ?? 0)
              .toNumber(),
          ) ?? [],
        color: Color.collateral,
      })
      entries.push({
        label: 'StakeX TVL',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(dayOrAvg(day, timeFrame).dusdDistribution?.stakeXTVL).toNumber(),
          ) ?? [],
        color: Color.stakeX,
      })
      entries.push({
        label: 'DMC',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(dayOrAvg(day, timeFrame).dusdDistribution?.otherOnDMC).toNumber(),
          ) ?? [],
        color: Color.dmc,
      })
      entries.push({
        label: 'Bond 1Y TVL',
        data:
          historyToCheck?.map((day) => new BigNumber(dayOrAvg(day, timeFrame).dusdDistribution?.tvlBond1).toNumber()) ??
          [],
        color: Color.bond1Y,
      })
      entries.push({
        label: 'Bond 2Y TVL',
        data:
          historyToCheck?.map((day) => new BigNumber(dayOrAvg(day, timeFrame).dusdDistribution?.tvlBond2).toNumber()) ??
          [],
        color: Color.bond2Y,
      })
      entries.push({
        label: 'Gateway pools',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(dayOrAvg(day, timeFrame).dusdDistribution?.gatewayPools).toNumber(),
          ) ?? [],
        color: Color.gatewayPools,
      })
      entries.push({
        label: 'dToken pools',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(dayOrAvg(day, timeFrame).dusdDistribution?.dTokenPools).toNumber(),
          ) ?? [],
        color: colorBasedOn('dToken'),
      })
      entries.push({
        label: 'YieldVault addresses',
        data:
          historyToCheck?.map((day) =>
            new BigNumber(dayOrAvg(day, timeFrame).dusdDistribution?.yieldVault).toNumber(),
          ) ?? [],
        color: Color.yieldVault,
      })
      entries.push({
        label: 'Free (approx.)',
        data:
          historyToCheck?.map((day) => new BigNumber(dayOrAvg(day, timeFrame).dusdDistribution?.free).toNumber()) ?? [],
        color: colorBasedOn('DUSD'),
      })
      entries.push({
        label: 'Locked',
        data:
          historyToCheck?.map((day) => new BigNumber(dayOrAvg(day, timeFrame).dusdDistribution?.inLock).toNumber()) ??
          [],
        color: Color.inLock,
      })
      break
  }

  return {
    labels: historyToCheck.map((entry) => moment(entry.meta.tstamp).utc().format('DD-MM-YYYY')),
    datasets: entries.map((entry) => ({
      label: entry.label,
      data: entry.data.map((d) => filterData(d)),
      borderColor: [entry.color],
      backgroundColor: [entry.color],
      hoverOffset: 4,
    })),
  }
}

function dayOrAvg(entry: DTokenStats, timeFrame: LineChartTimeFrame): any {
  return entry.avg7days && (timeFrame === LineChartTimeFrame.ALL || timeFrame === LineChartTimeFrame.THREE_MONTHS)
    ? entry.avg7days
    : entry
}

function filterData(data: number): number {
  return data !== 0 ? data : NaN
}

export function toScales(type: string): any {
  return undefined
}
