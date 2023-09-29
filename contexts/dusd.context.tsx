import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createClient, getLoanTokens, getPoolPairs, getPrices } from '../api/whale-api'
import BigNumber from 'bignumber.js'
import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'
import { DUSDResult } from '../dtos/dusd-result.dto'

interface DUSDContextInterface {
  isLoading: boolean
  gatewayPools: PoolPairData[]
  disabledPoolIds: string[]
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
      const feeFac = new BigNumber(1).minus(DUSDToken.fee?.inPct ?? 0)
      const dusdIn = soldAmount.times(part).times(feeFac)

      // newPrice= newOther / newDUSD = (K/newDUSD)/newDUSD
      const newRatio = K.div(dusdReserve.plus(dusdIn)).div(dusdReserve.plus(dusdIn))
      newdusdPricePerToken[otherToken.symbol] = newRatio.times(tokenPrices[otherToken.symbol])
    })
    return newdusdPricePerToken
  }

  function neededDUSDForPeg(tradedPools: PoolPairData[]): {
    [keys: string]: { coin: BigNumber; dusd: BigNumber }
  } {
    if (!poolpairs || !prices) return {}
    const pools = poolpairs.filter((p) => tradedPools.indexOf(p) > -1)
    const neededPerToken: { [keys: string]: { coin: BigNumber; dusd: BigNumber } } = {}

    const tokenPrices: { [keys: string]: BigNumber } = {}
    prices.forEach((p) => {
      tokenPrices[p.price.token] = new BigNumber(p.price.aggregated.amount)
    })

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
    })
    return neededPerToken
  }

  function analyze(amountSold: BigNumber): DUSDResult {
    const poolPairs = gatewayPools.filter((p) => !disabledPoolIds.includes(p.id))
    const neededPeg = neededDUSDForPeg(poolPairs)
    let total = new BigNumber(0)
    for (const token in neededPeg) {
      const v = neededPeg[token]
      total = total.plus(v.dusd)
    }

    const newPrice = dusdPriceAfterSell(amountSold, poolPairs)

    return { amountSold, neededDUSDForPeg: neededPeg, totalDUSDNeeded: total, dUSDAfterSell: newPrice }
  }

  const context = useMemo(
    () => ({ isLoading, gatewayPools, disabledPoolIds, analyze, changePool }),
    [poolpairs, prices, isLoading, gatewayPools, disabledPoolIds],
  )

  return <DUSDContext.Provider value={context}>{props.children}</DUSDContext.Provider>
}
