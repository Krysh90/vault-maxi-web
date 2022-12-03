export interface VaultStats {
  tstamp: Date
  params: VaultStatsParams
  totalVaults: number
  nonEmptyVaults: number
  usedVaults: number
  allBotVaults: number
  donatingMaxis: number
  botData: VaultStatsBotData
}

export interface VaultStatsParams {
  minCollateral: number
  maxHistory: number
}

export interface VaultStatsBotData {
  allBotVaults: VaultStatsBotDataEntry
  dusdSingleMintMaxi: VaultStatsBotDataEntry
  dfiSingleMintMaxi: VaultStatsBotDataEntry
  doubleMintMaxi: VaultStatsBotDataEntry
  wizard: VaultStatsBotDataEntry
}

export interface VaultStatsBotDataEntry {
  minRatio: number
  maxRatio: number
  avgRatio: number
  avgRatioWeighted: number
  totalCollateral: number
  totalLoans: number
  minCollateral: number
  maxCollateral: number
  totalVaults: number
}
