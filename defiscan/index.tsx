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
import { dEUROC } from './dEUROC'
import { DOT } from './DOT'
import { dDOT } from './dDOT'
import { dSOL } from './dSOL'
import { SOL } from './SOL'
import { MATIC } from './MATIC'
import { dMATIC } from './dMATIC'
import { dSUI } from './dSUI'
import { XCHF } from './XCHF'
import { dXCHF } from './dXCHF'

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
  dEUROC: dEUROC,
  EUROC: dEUROC,
  DOT: DOT,
  dDOT: dDOT,
  MATIC: MATIC,
  dMATIC: dMATIC,
  SOL: SOL,
  dSOL: dSOL,
  XCHF: XCHF,
  dXCHF: dXCHF,
  dSUI: dSUI,
}

// TODO(@defich): move assets into it's own repo where anyone can create pull request into.
//  Following a vector specification guideline, this allows anyone to create PR into that repo.

/**
 * @param {string} symbol of the asset icon
 * @return {(props: SVGProps<SVGSVGElement>) => JSX.Element}
 */
export function getAssetIcon(symbol: string): (props: SVGProps<SVGSVGElement>) => JSX.Element {
  if (symbol.includes('-')) {
    return PoolPairIcon(symbol)
  }
  const Icon = mapping[symbol] ?? mapping[`d${symbol}`]
  if (Icon === undefined) {
    // if its a loan token
    return _TokenDefault(symbol)
  }
  return Icon
}

function PoolPairIcon(symbol: string): (props: SVGProps<SVGSVGElement>) => JSX.Element {
  const tokens = symbol.split('-')
  // eslint-disable-next-line react/display-name
  return (props) => (
    <div className="flex flex-row">
      <div style={{ zIndex: 1 }}>{getAssetIcon(tokens[0])(props)}</div>
      <div style={{ marginTop: 2, marginLeft: -6, zIndex: 0 }}>
        {getAssetIcon(tokens[1])({ width: 20, height: 20 })}
      </div>
    </div>
  )
}
