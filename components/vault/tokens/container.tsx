import { CollateralToken, LoanToken } from '@defichain/whale-api-client/dist/api/loan'
import { Token } from './token'
import BigNumber from 'bignumber.js'
import { VaultToken, VaultTokenType } from '../../../contexts/vault.context'

interface TokenContainerProps {
  title: string
  tokens: VaultToken[]
  type: VaultTokenType
}

export function TokenContainer({ title, tokens, type }: TokenContainerProps): JSX.Element {
  return (
    <div className="flex flex-col flex-wrap">
      <h1 className="text-2xl text-code">{title}</h1>
      <div className="flex flex-row flex-wrap gap-3 py-4">
        {tokens.map((token) => (
          <Token
            key={token.token.symbolKey}
            id={token.tokenId}
            symbol={token.token.symbol}
            type={type}
            price={new BigNumber(token.activePrice?.active?.amount ?? '1')}
          />
        ))}
      </div>
    </div>
  )
}
