import { DragEvent, useState } from 'react'
import { VaultToken, VaultTokenType, useVaultContext } from '../../contexts/vault.context'
import { useVaultSimulator } from '../../hooks/vault-simulator.hook'
import { VaultEntry } from './tokens/vault-entry'
import BigNumber from 'bignumber.js'

interface TokenDropZoneProps {
  type: VaultTokenType
}

export function TokenDropZone({ type }: TokenDropZoneProps): JSX.Element {
  const { setToken, getAmount, vaultCollateralTokens, vaultLoanTokens, collateralValue, loanValue } = useVaultContext()
  const { decode } = useVaultSimulator()
  const [isOverZone, setIsOverZone] = useState(false)

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain')
    if (data.startsWith(type)) {
      const token = decode(data)
      if (token) {
        setToken(token, getAmount(token))
      }
    }
    setIsOverZone(false)
  }

  function getTokens(): VaultToken[] {
    return type === 'Collateral' ? vaultCollateralTokens : vaultLoanTokens
  }

  function getTotalValue(): BigNumber {
    return type === 'Collateral' ? collateralValue : loanValue
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-2xl text-code">{type}</h2>
        <p>{getTotalValue().decimalPlaces(2).toString()}$</p>
      </div>
      <div
        className={`border border-dashed flex flex-col gap-2 p-1 rounded-lg min-h-drop ${
          isOverZone ? 'border-main' : 'border-light'
        }`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onDragEnter={() => setIsOverZone(true)}
        onDragLeave={() => setIsOverZone(false)}
      >
        {getTokens()?.map((token) => (
          <VaultEntry key={token.tokenId} token={token} />
        ))}
      </div>
    </>
  )
}
