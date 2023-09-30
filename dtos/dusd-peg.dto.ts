import BigNumber from 'bignumber.js'

export interface DUSDPeg {
  neededDUSDForPeg: {
    [keys: string]: { coin: BigNumber; dusd: BigNumber }
  }
  totalDUSDNeeded: BigNumber
  totalUSDNeeded: BigNumber
}
