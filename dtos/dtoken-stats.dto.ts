import BigNumber from 'bignumber.js'

export interface DTokenStats {
  meta: { tstamp: string; analysedAt: number }
  dTokens: DTokenStatsEntry[]
}

export interface DTokenStatsEntry {
  key: string
  minted: DTokenStatsMinted
  burn: DTokenStatsBurn
  openinterest: number
  price: number
}

export interface DTokenStatsMinted {
  chainReported: number
  futureswap: number
  loans: number
  dfipayback: number
}

export interface DTokenStatsBurn {
  futureswap: number
  other: number
}
