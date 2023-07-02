import { DragEvent, useEffect, useState } from 'react'
import { getAssetIcon } from '../../../defiscan'
import BigNumber from 'bignumber.js'
import { VaultToken, VaultTokenType, useVaultContext } from '../../../contexts/vault.context'
import { useVaultSimulator } from '../../../hooks/vault-simulator.hook'

interface TokenProps {
  id: string
  symbol: string
  type: VaultTokenType
  price: BigNumber
}

export function Token({ id, symbol, type, price }: TokenProps): JSX.Element {
  const { setToken, collateralTokens, loanTokens } = useVaultContext()
  const { encode } = useVaultSimulator()
  const AssetIcon = getAssetIcon(symbol)
  const [isDragging, setDragging] = useState(false)

  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    setDragging(true)
    event.dataTransfer.setData('text/plain', encode(type, id))
  }

  function getToken(): VaultToken | undefined {
    return type === 'Collateral'
      ? collateralTokens.find((token) => token.tokenId === id)
      : loanTokens.find((token) => token.tokenId === id)
  }

  return (
    <div
      className={`bg-light flex flex-row gap-2 rounded-lg px-2 py-1.5 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onClick={() => {
        const token = getToken()
        if (token) setToken(token, new BigNumber(1))
      }}
      onDragStart={handleDragStart}
      onDragEnd={() => setDragging(false)}
      draggable
    >
      <div className="flex flex-row gap-1">
        <AssetIcon width={24} height={24} />
        <p>{symbol}</p>
      </div>
      <p>{price.decimalPlaces(2).toString()}$</p>
    </div>
  )
}
