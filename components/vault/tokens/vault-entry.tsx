import { useState } from 'react'
import { VaultToken, useVaultContext } from '../../../contexts/vault.context'
import { getAssetIcon } from '../../../defiscan'
import ThemedInput from '../../base/themed-input'
import BigNumber from 'bignumber.js'

interface VaultEntryProps {
  token: VaultToken
}

export function VaultEntry({ token }: VaultEntryProps): JSX.Element {
  const { setToken, vaultInterest } = useVaultContext()
  const AssetIcon = getAssetIcon(token.token.symbol)
  const [amount, setAmount] = useState<number>(1)

  function getCollateralFactor(token: VaultToken): BigNumber {
    return new BigNumber('interest' in token ? '1' : token.factor)
  }

  function onChange(value: string) {
    const v = Number(value)
    setAmount(v)
    setToken(token, new BigNumber(v))
  }

  return (
    <div className="flex flex-row flex-wrap items-center rounded-lg bg-light p-1 w-full pointer-events-none">
      <div className="flex flex-row flex-shrink w-32 gap-1">
        <AssetIcon width={24} height={24} />
        <p>{token.token.symbol}</p>
      </div>
      <ThemedInput
        className="bg-dark text-center w-40 rounded-lg pointer-events-auto"
        type="number"
        value={'' + amount}
        enterKeyHint="done"
        onChange={onChange}
        noSubmit
      />
      {'interest' in token && (
        <p className="text-right w-24">
          {new BigNumber(token.interest).plus(vaultInterest).decimalPlaces(2).toString()}%
        </p>
      )}
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
