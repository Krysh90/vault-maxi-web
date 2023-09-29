import BigNumber from 'bignumber.js'

export interface DUSDResult {
  amountSold: BigNumber
  neededDUSDForPeg: {
    [keys: string]: { coin: BigNumber; dusd: BigNumber }
  }
  totalDUSDNeeded: BigNumber
  dUSDAfterSell: { [keys: string]: BigNumber }
}
