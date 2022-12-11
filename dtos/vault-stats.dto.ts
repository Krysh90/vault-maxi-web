export interface VaultStats {
  tstamp: string
  params: VaultStatsParams
  totalVaults: number
  nonEmptyVaults: number
  usedVaults: number
  allBotVaults: number
  donatingMaxis: number
  vaultData: VaultStatsData
  botData: VaultStatsBotData
}

export interface VaultStatsParams {
  minCollateral: number
  maxHistory: number
}

export interface VaultStatsBotData {
  allBotVaults: VaultStatsDataEntry
  dusdSingleMintMaxi: VaultStatsDataEntry
  dfiSingleMintMaxi: VaultStatsDataEntry
  doubleMintMaxi: VaultStatsDataEntry
  wizard: VaultStatsDataEntry
}

export interface VaultStatsData {
  nonEmptyVaults: VaultStatsDataEntry
  usedVaults: VaultStatsDataEntry
}

export interface VaultStatsDataEntry {
  minRatio: number
  maxRatio: number
  avgRatio: number
  avgRatioWeighted: number
  totalCollateral: number
  totalLoans: number
  totalDUSDLoans: number
  minCollateral: number
  maxCollateral: number
  totalVaults: number
}
