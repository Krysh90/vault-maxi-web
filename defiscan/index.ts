import { SVGProps } from 'react'
import { USDC } from './USDC'
import { dBCH } from './dBCH'
import { dBTC } from './dBTC'
import { BTC } from './BTC'
import { BCH } from './BCH'
import { LTC } from './LTC'
import { dDFI } from './dDFI'
import { dDOGE } from './dDOGE'
import { dETH } from './dETH'
import { DFI } from './DFI'
import { dLTC } from './dLTC'
import { dUSDC } from './dUSDC'
import { dUSDT } from './dUSDT'
import { DUSD } from './DUSD'
import { _TokenDefault } from './_TokenDefault'

const mapping: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  DFI: DFI,
  BTC: BTC,
  BCH: BCH,
  LTC: LTC,
  USDC: USDC,
  dBCH: dBCH,
  dBTC: dBTC,
  dDFI: dDFI,
  dDOGE: dDOGE,
  dETH: dETH,
  dLTC: dLTC,
  dUSDT: dUSDT,
  dUSDC: dUSDC,
  dDUSD: DUSD,
  DUSD: DUSD,
}

// TODO(@defich): move assets into it's own repo where anyone can create pull request into.
//  Following a vector specification guideline, this allows anyone to create PR into that repo.

/**
 * @param {string} symbol of the asset icon
 * @return {(props: SVGProps<SVGSVGElement>) => JSX.Element}
 */
export function getAssetIcon(symbol: string): (props: SVGProps<SVGSVGElement>) => JSX.Element {
  const Icon = mapping[symbol] ?? mapping[`d${symbol}`]
  if (Icon === undefined) {
    // if its a loan token
    return _TokenDefault(symbol)
  }
  return Icon
}
