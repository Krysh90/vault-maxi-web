import BigNumber from 'bignumber.js'

export interface DUSDResult {
  amountSold: BigNumber
  dUSDAfterSell: { [keys: string]: BigNumber }
}
