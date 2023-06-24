export interface DTokenStats {
  meta: { tstamp: string; analysedAt: number; startHeight: number; endHeight: number }
  dTokens: DTokenStatsEntry[]
  dusdVolume: {
    bots: DUSDVolume
    organic: DUSDVolume
  }
}

export interface DUSDVolume {
  buying: string
  selling: string
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
