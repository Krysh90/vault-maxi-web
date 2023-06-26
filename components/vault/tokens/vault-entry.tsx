import { useState } from 'react'
import { VaultToken } from '../../../contexts/vault.context'
import { getAssetIcon } from '../../../defiscan'
import ThemedInput from '../../base/themed-input'
import BigNumber from 'bignumber.js'

interface VaultEntryProps {
  token: VaultToken
}

export function VaultEntry({ token }: VaultEntryProps): JSX.Element {
  const AssetIcon = getAssetIcon(token.token.symbol)
  const [amount, setAmount] = useState<number>(1)

  function getCollateralFactor(token: VaultToken): BigNumber {
    return new BigNumber('interest' in token ? '1' : token.factor)
  }

  return (
    <div className="flex flex-row flex-wrap items-center rounded-lg bg-light p-1 w-full pointer-events-none">
      <div className="flex flex-row flex-shrink w-32 gap-1">
        <AssetIcon width={24} height={24} />
        <p>{token.token.symbol}</p>
      </div>
      <ThemedInput
        className="bg-dark text-center w-16 rounded-lg pointer-events-auto"
        type="number"
        value={'' + amount}
        enterKeyHint="done"
        onChange={(s) => setAmount(+(s ?? '0'))}
        noSubmit
      />
      <p className="px-2 flex-grow text-right">
        {new BigNumber(token.activePrice?.active?.amount ?? '1')
          .multipliedBy(getCollateralFactor(token))
          .multipliedBy(amount)
          .decimalPlaces(2)
          .toString()}
        $
      </p>
    </div>
  )
}
