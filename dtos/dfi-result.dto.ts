import BigNumber from 'bignumber.js'

export interface DFIResult {
  wordingBefore: string
  wordingAfter: string
  amountSold: BigNumber
  dfiAfterSell: { [keys: string]: BigNumber }
}
