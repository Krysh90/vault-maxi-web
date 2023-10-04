import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createClient, getLoanTokens, getPoolPairs, getPrices } from '../api/whale-api'
import BigNumber from 'bignumber.js'
import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'
import { DUSDResult } from '../dtos/dusd-result.dto'
import { DUSDPeg } from '../dtos/dusd-peg.dto'
import { formatNumber } from '../lib/chart.lib'

interface DUSDContextInterface {
  isLoading: boolean
  gatewayPools: PoolPairData[]
  disabledPoolIds: string[]
  calculatePeg: () => DUSDPeg
  analyze: (amount: BigNumber) => DUSDResult
  changePool: (poolPair: PoolPairData, shouldBeAnalyzed: boolean) => void
}

const DUSDContext = createContext<DUSDContextInterface>(undefined as any)

export function useDUSDContext(): DUSDContextInterface {
  return useContext(DUSDContext)
}

export function DUSDContextProvider(props: PropsWithChildren): JSX.Element {
  const [isLoading, setLoading] = useState(true)
  const [poolpairs, setPoolpairs] = useState<PoolPairData[]>()
  const [prices, setPrices] = useState<PriceTicker[]>()
  const [loanTokens, setLoanTokens] = useState<string[]>([])
  const [disabledPoolIds, setDisabledPoolIds] = useState<string[]>([])
  const dataFetchedRef = useRef(false)

  const client = createClient()

  useEffect(() => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    Promise.all([getPoolPairs(client), getPrices(client), getLoanTokens(client)]).then(([pp, p, lt]) => {
      setPoolpairs(pp)
      setPrices(p)
      setLoanTokens(lt.map((t) => t.token.symbol))
      const poolToDisable = pp.find((d) => d.symbol === 'XCHF-DUSD')
      setDisabledPoolIds(poolToDisable ? [poolToDisable.id] : [])
      setLoading(false)
    })
  }, [client])

  const gatewayPools =
    poolpairs?.filter(
      (p) =>
        p.status &&
        +p.totalLiquidity.token > 0 &&
        ((p.tokenA.symbol == 'DUSD' && loanTokens?.indexOf(p.tokenB.symbol) < 0) ||
          (p.tokenB.symbol == 'DUSD' && loanTokens?.indexOf(p.tokenA.symbol) < 0)),
    ) ?? []

  function changePool(poolPair: PoolPairData, shouldBeAnalyzed: boolean) {
    setDisabledPoolIds((ids) => (shouldBeAnalyzed ? ids.filter((pp) => pp !== poolPair.id) : [...ids, poolPair.id]))
  }

  function dusdPriceAfterSell(soldAmount: BigNumber, tradedPools: PoolPairData[]): { [keys: string]: BigNumber } {
    if (!poolpairs || !prices) return {}
    const pools = poolpairs.filter((p) => tradedPools.indexOf(p) > -1)
    const totalLiquidity = pools
      .map((p) => (p.tokenA.symbol == 'DUSD' ? p.tokenA.reserve : p.tokenB.reserve))
      .reduce((a, b) => a.plus(b), new BigNumber(0))

    const newdusdPricePerToken: { [keys: string]: BigNumber } = {}

    const tokenPrices: { [keys: string]: BigNumber } = {}
    prices.forEach((p) => {
      tokenPrices[p.price.token] = new BigNumber(p.price.aggregated.amount)
    })

    pools.forEach((p) => {
      const AtoB = p.tokenA.symbol == 'DUSD'
      const DUSDToken = AtoB ? p.tokenA : p.tokenB
      const otherToken = AtoB ? p.tokenB : p.tokenA
      const part = new BigNumber(DUSDToken.reserve).div(totalLiquidity)
      const K = new BigNumber(p.tokenA.reserve).times(p.tokenB.reserve)
      const dusdReserve = new BigNumber(DUSDToken.reserve)
      const fee = (soldAmount.gt(0) ? DUSDToken.fee?.inPct : 0) ?? 0
      const feeFac = new BigNumber(1).minus(fee)
      const dusdIn = soldAmount.times(part).times(feeFac)

      // newPrice= newOther / newDUSD = (K/newDUSD)/newDUSD
      const newRatio = dusdReserve.plus(dusdIn).gte(0)
        ? K.div(dusdReserve.plus(dusdIn)).div(dusdReserve.plus(dusdIn))
        : new BigNumber(999999999)
      newdusdPricePerToken[otherToken.symbol] = newRatio.times(tokenPrices[otherToken.symbol])
    })
    return newdusdPricePerToken
  }

  function neededDUSDForPeg(tradedPools: PoolPairData[]): {
    neededPerToken: {
      [keys: string]: { coin: BigNumber; dusd: BigNumber }
    }
    totalInUSD: BigNumber
  } {
    if (!poolpairs || !prices) return { neededPerToken: {}, totalInUSD: new BigNumber(0) }
    const pools = poolpairs.filter((p) => tradedPools.indexOf(p) > -1)
    const neededPerToken: { [keys: string]: { coin: BigNumber; dusd: BigNumber } } = {}

    const tokenPrices: { [keys: string]: BigNumber } = {}
    prices.forEach((p) => {
      tokenPrices[p.price.token] = new BigNumber(p.price.aggregated.amount)
    })

    let totalInUSD = new BigNumber(0)
    pools.forEach((p) => {
      const AtoB = p.tokenA.symbol == 'DUSD'
      const DUSDToken = AtoB ? p.tokenA : p.tokenB
      const otherToken = AtoB ? p.tokenB : p.tokenA

      const K = new BigNumber(p.tokenA.reserve).times(p.tokenB.reserve)
      const newDusdReserve = Math.sqrt(K.times(tokenPrices[otherToken.symbol]).toNumber())
      const newOtherReserve = K.div(newDusdReserve)
      neededPerToken[otherToken.symbol] = {
        coin: newOtherReserve.minus(otherToken.reserve),
        dusd: new BigNumber(DUSDToken.reserve).minus(newDusdReserve),
      }
      totalInUSD = totalInUSD.plus(tokenPrices[otherToken.symbol].times(neededPerToken[otherToken.symbol].coin))
    })
    return { neededPerToken, totalInUSD }
  }

  function calculatePeg(): DUSDPeg {
    const poolPairs = gatewayPools.filter((p) => !disabledPoolIds.includes(p.id))
    const peg = neededDUSDForPeg(poolPairs)

    let total = new BigNumber(0)
    for (const token in peg.neededPerToken) {
      const v = peg.neededPerToken[token]
      total = total.plus(v.dusd)
    }

    return { neededDUSDForPeg: peg.neededPerToken, totalDUSDNeeded: total, totalUSDNeeded: peg.totalInUSD }
  }

  function analyze(amountSold: BigNumber): DUSDResult {
    const poolPairs = gatewayPools.filter((p) => !disabledPoolIds.includes(p.id))

    const newPrice = dusdPriceAfterSell(amountSold, poolPairs)

    return {
      amountSold,
      dUSDAfterSell: newPrice,
      wording: amountSold.gte(0)
        ? `after a sell of ${formatNumber(amountSold.decimalPlaces(0).toNumber())}`
        : `after a buy of ${formatNumber(amountSold.negated().decimalPlaces(0).toNumber())}`,
    }
  }

  const context = useMemo(
    () => ({ isLoading, gatewayPools, disabledPoolIds, calculatePeg, analyze, changePool }),
    [poolpairs, prices, isLoading, gatewayPools, disabledPoolIds],
  )

  return <DUSDContext.Provider value={context}>{props.children}</DUSDContext.Provider>
}
