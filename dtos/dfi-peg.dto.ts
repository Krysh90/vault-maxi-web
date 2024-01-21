import BigNumber from 'bignumber.js'

export interface DFIPeg {
  neededDFIForPeg: {
    [keys: string]: { coin: BigNumber; dfi: BigNumber }
  }
  totalDFINeeded: BigNumber
  totalUSDNeeded: BigNumber
}
