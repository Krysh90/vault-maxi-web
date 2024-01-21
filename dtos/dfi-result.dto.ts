import BigNumber from 'bignumber.js'

export interface DFIResult {
  wording: string
  amountSold: BigNumber
  dfiAfterSell: { [keys: string]: BigNumber }
}
