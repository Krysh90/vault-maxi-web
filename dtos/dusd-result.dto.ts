import BigNumber from 'bignumber.js'

export interface DUSDResult {
  wording: string
  amountSold: BigNumber
  dUSDAfterSell: { [keys: string]: BigNumber }
}
