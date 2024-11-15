export interface DTokenStats {
  meta: { tstamp: string; analysedAt: number; startHeight: number; endHeight: number }
  dTokens: DTokenStatsEntry[]
  dusdVolume: {
    bots: DUSDVolume
    organic: DUSDVolume
    fee?: string
  }
  dusdDistribution: {
    collateral: string
    gatewayPools: string
    dTokenPools: string
    yieldVault: string
    free: string
    stakeXTVL: string
    stakeXLoop: string
    tvlBond1: string
    tvlBond2: string
    otherOnDMC: string
    inLock: string
  }
  avg7days?: {
    dTokens: DTokenStatsEntry[]
    dusdVolume: {
      bots: DUSDVolume
      organic: DUSDVolume
      fee?: string
    }
    dusdDistribution: {
      collateral: string
      gatewayPools: string
      dTokenPools: string
      yieldVault: string
      free: string
      stakeXTVL: string
      stakeXLoop: string
      tvlBond1: string
      tvlBond2: string
      otherOnDMC: string
    }
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
