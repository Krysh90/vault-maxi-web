export interface Token {
  id: number
  symbol: string
  type: TokenType
  canBeCollateral: boolean
}

export enum TokenType {
  POOL_PAIR = 'PoolPair',
  COIN = 'Coin',
}
