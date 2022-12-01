import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { CollateralToken } from '@defichain/whale-api-client/dist/api/loan'
import { Token, TokenType } from '../dtos/token.dto'

const blockedPairs: string[] = []

export function toTokens(poolpairs: PoolPairData[], collateralTokens: CollateralToken[]): Token[] {
  const filteredPoolpairs = poolpairs.filter((p) => p.status && !blockedPairs.includes(p.symbol))
  const tokens = new Map<string, Token>()
  const pairs = new Map<string, Token>()
  filteredPoolpairs.forEach((p) => {
    pairs.set(p.symbol, { id: +p.id, symbol: p.symbol, type: TokenType.POOL_PAIR, canBeCollateral: false })
    tokens.set(p.tokenA.symbol, {
      id: +p.tokenA.id,
      symbol: p.tokenA.symbol,
      type: TokenType.COIN,
      canBeCollateral: canBeCollateral(collateralTokens, p.tokenA.symbol),
    })
    tokens.set(p.tokenB.symbol, {
      id: +p.tokenB.id,
      symbol: p.tokenB.symbol,
      type: TokenType.COIN,
      canBeCollateral: canBeCollateral(collateralTokens, p.tokenB.symbol),
    })
  })
  const sortedTokens = Array.from(tokens.values()).sort((a, b) => a.id - b.id)
  const sortedPairs = Array.from(pairs.values()).sort((a, b) => a.id - b.id)
  return sortedTokens.concat(sortedPairs)
}

function canBeCollateral(tokens: CollateralToken[], symbol: string): boolean {
  return tokens.find((c) => c.token.symbol === symbol) != null
}
