import { DragEvent, useEffect, useState } from 'react'
import { getAssetIcon } from '../../../defiscan'
import BigNumber from 'bignumber.js'
import { VaultTokenType } from '../../../contexts/vault.context'
import { useVaultSim } from '../../../hooks/vault-sim.hook'

interface TokenProps {
  id: string
  symbol: string
  type: VaultTokenType
  price: BigNumber
}

export function Token({ id, symbol, type, price }: TokenProps): JSX.Element {
  const { encode } = useVaultSim()
  const AssetIcon = getAssetIcon(symbol)
  const [isDragging, setDragging] = useState(false)

  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    setDragging(true)
    event.dataTransfer.setData('text/plain', encode(type, id))
  }

  return (
    <div
      className={`bg-light flex flex-row gap-2 rounded-lg px-2 py-1.5 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onClick={() => console.log('click', symbol)}
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
