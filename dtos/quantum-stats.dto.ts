export interface QuantumStats {
  meta: { tstamp: string; analysedAt: number }
  txsInBlocks: {
    '2880': QuantumTokenTxStats[]
    '86400': QuantumTokenTxStats[]
  }
  liquidity: { hotwallet?: QuantumWalletStats; coldWallet?: QuantumWalletStats }
}

export interface QuantumTokenTxStats {
  tokenName: string
  txsIn: number
  txsOut: number
  coinsIn: string
  coinsOut: string
  maxIn: string
  maxOut: string
  liquidity: string
  oraclePrice: string
}

export interface QuantumWalletStats {
  [key: string]: string
}
