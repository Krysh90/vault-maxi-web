export interface QuantumStats {
  meta: { tstamp: string; analysedAt: number }
  prices: TokenBalances
  txs: QuantumTx[]
  liquidity: { defichain: TokenBalances; ethereum: TokenBalances }
  quantumData: QuantumData
}

export interface QuantumTx {
  tokenName: string
  txsToEthereum: number
  txsToDefichain: number
  coinsToEthereum: string
  coinsToDefichain: string
  maxToEthereum: string
  maxToDefichain: string
}

export interface QuantumData {
  liqEth: TokenBalances
  liqDfc: TokenBalances
  txsToDfc: QuantumBridgeTxStats
  txsToEth: QuantumBridgeTxStats
}

export interface QuantumBridgeTxStats {
  totalTransactions: number
  confirmedTransactions: number
  amountBridged: TokenBalances
  totalBridgedAmount: TokenBalances
}

export interface TokenBalances {
  [key: string]: string
}
