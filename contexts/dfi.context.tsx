import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createClient, getLoanTokens, getPoolPairs, getPrices } from '../api/whale-api'
import BigNumber from 'bignumber.js'
import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'
import { formatNumber } from '../lib/chart.lib'
import { DFIPeg } from '../dtos/dfi-peg.dto'
import { DFIResult } from '../dtos/dfi-result.dto'

interface DFIContextInterface {
  isLoading: boolean
  pools: PoolPairData[]
  disabledPoolIds: string[]
  dfiPrice?: string
  calculateIncrease: (percentage: number) => DFIPeg
  analyze: (amount: BigNumber) => DFIResult
  changePool: (poolPair: PoolPairData, shouldBeAnalyzed: boolean) => void
}

const DFIContext = createContext<DFIContextInterface>(undefined as any)

export function useDFIContext(): DFIContextInterface {
  return useContext(DFIContext)
}

const poolsToCheck = ['BTC-DFI', 'ETH-DFI', 'USDT-DFI', 'USDC-DFI'] // 'SOL-DFI',

export function DFIContextProvider(props: PropsWithChildren): JSX.Element {
  const [isLoading, setLoading] = useState(true)
  const [poolpairs, setPoolpairs] = useState<PoolPairData[]>()
  const [prices, setPrices] = useState<PriceTicker[]>()
  const [disabledPoolIds, setDisabledPoolIds] = useState<string[]>([])
  const dataFetchedRef = useRef(false)

  const client = createClient()

  useEffect(() => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    Promise.all([getPoolPairs(client), getPrices(client)]).then(([pp, p]) => {
      setPoolpairs(pp)
      setPrices(p)
      setDisabledPoolIds([])
      setLoading(false)
    })
  }, [client])

  const pools =
    poolpairs?.filter((p) => p.status && +p.totalLiquidity.token > 0 && poolsToCheck.includes(p.symbol)) ?? []

  function changePool(poolPair: PoolPairData, shouldBeAnalyzed: boolean) {
    setDisabledPoolIds((ids) => (shouldBeAnalyzed ? ids.filter((pp) => pp !== poolPair.id) : [...ids, poolPair.id]))
  }

  function dfiPriceAfterSell(soldAmount: BigNumber, tradedPools: PoolPairData[]): { [keys: string]: BigNumber } {
    if (!poolpairs || !prices) return {}
    const pools = poolpairs.filter((p) => tradedPools.indexOf(p) > -1)
    const totalLiquidity = pools
      .map((p) => (p.tokenA.symbol == 'DFI' ? p.tokenA.reserve : p.tokenB.reserve))
      .reduce((a, b) => a.plus(b), new BigNumber(0))

    const newdfiPricePerToken: { [keys: string]: BigNumber } = {}

    const tokenPrices: { [keys: string]: BigNumber } = {}
    prices.forEach((p) => {
      tokenPrices[p.price.token] = new BigNumber(p.price.aggregated.amount)
    })

    pools.forEach((p) => {
      const AtoB = p.tokenA.symbol == 'DFI'
      const DFIToken = AtoB ? p.tokenA : p.tokenB
      const otherToken = AtoB ? p.tokenB : p.tokenA
      const part = new BigNumber(DFIToken.reserve).div(totalLiquidity)
      const K = new BigNumber(p.tokenA.reserve).times(p.tokenB.reserve)
      const dfiReserve = new BigNumber(DFIToken.reserve)
      const fee = (soldAmount.gt(0) ? DFIToken.fee?.inPct : 0) ?? 0
      const feeFac = new BigNumber(1).minus(fee)
      const dfiIn = soldAmount.times(part).times(feeFac)

      // newPrice= newOther / newDFI = (K/newDFI)/newDFI
      const newRatio = dfiReserve.plus(dfiIn).gte(0)
        ? K.div(dfiReserve.plus(dfiIn)).div(dfiReserve.plus(dfiIn))
        : new BigNumber(999999999)
      newdfiPricePerToken[otherToken.symbol] = newRatio.times(tokenPrices[otherToken.symbol])
    })
    return newdfiPricePerToken
  }

  function neededDFIForIncrease(
    tradedPools: PoolPairData[],
    percentage: number,
  ): {
    neededPerToken: {
      [keys: string]: { coin: BigNumber; dfi: BigNumber }
    }
    totalInUSD: BigNumber
  } {
    if (!poolpairs || !prices) return { neededPerToken: {}, totalInUSD: new BigNumber(0) }
    const pools = poolpairs.filter((p) => tradedPools.indexOf(p) > -1)
    const neededPerToken: { [keys: string]: { coin: BigNumber; dfi: BigNumber } } = {}

    const tokenPrices: { [keys: string]: BigNumber } = {}
    prices.forEach((p) => {
      tokenPrices[p.price.token] = new BigNumber(p.price.aggregated.amount)
    })

    let totalInUSD = new BigNumber(0)
    pools.forEach((p) => {
      const AtoB = p.tokenA.symbol == 'DFI'
      const DFIToken = AtoB ? p.tokenA : p.tokenB
      const otherToken = AtoB ? p.tokenB : p.tokenA

      const coin = new BigNumber(otherToken.reserve).times(Math.sqrt(1 + percentage) - 1)
      const dfi = new BigNumber(DFIToken.reserve).times(1 - Math.sqrt(1 / (1 + percentage)))
      neededPerToken[otherToken.symbol] = {
        coin,
        dfi,
      }
      totalInUSD = totalInUSD.plus(tokenPrices[otherToken.symbol].times(neededPerToken[otherToken.symbol].coin))
    })
    return { neededPerToken, totalInUSD }
  }

  function calculateIncrease(percentage: number): DFIPeg {
    const poolPairs = pools.filter((p) => !disabledPoolIds.includes(p.id))
    const peg = neededDFIForIncrease(poolPairs, percentage)

    let total = new BigNumber(0)
    for (const token in peg.neededPerToken) {
      const v = peg.neededPerToken[token]
      total = total.plus(v.dfi)
    }

    return { neededDFIForPeg: peg.neededPerToken, totalDFINeeded: total, totalUSDNeeded: peg.totalInUSD }
  }

  function analyze(amountSold: BigNumber): DFIResult {
    const poolPairs = pools.filter((p) => !disabledPoolIds.includes(p.id))

    const newPrice = dfiPriceAfterSell(amountSold, poolPairs)

    return {
      amountSold,
      dfiAfterSell: newPrice,
      wording: amountSold.gte(0)
        ? `after a sell of ${formatNumber(amountSold.decimalPlaces(0).toNumber())}`
        : `after a buy of ${formatNumber(amountSold.negated().decimalPlaces(0).toNumber())}`,
    }
  }

  const context = useMemo(
    () => ({
      isLoading,
      pools,
      disabledPoolIds,
      calculateIncrease,
      analyze,
      changePool,
      dfiPrice: prices?.find((p) => p.price.token === 'DFI')?.price.aggregated.amount,
    }),
    [poolpairs, prices, isLoading, pools, disabledPoolIds],
  )

  return <DFIContext.Provider value={context}>{props.children}</DFIContext.Provider>
}
