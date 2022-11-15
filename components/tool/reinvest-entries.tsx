import React, { useContext, useState } from 'react'
import { ReinvestTarget } from '../../dtos/reinvest-target.dto'
import { faCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import uuid from 'react-uuid'
import Dropdown from '../base/dropdown'
import { ReinvestContext } from '../../contexts/reinvest.context'

export interface ReinvestEntriesProps {}

export default function ReinvestEntries({}: ReinvestEntriesProps) {
  const reinvestContext = useContext(ReinvestContext)

  const onAdd = (): void => {
    reinvestContext.update(reinvestContext.targets.concat({ id: uuid(), value: 10, name: 'DFI' }))
  }

  const onRemove = (entry?: ReinvestTarget): void => {
    reinvestContext.update(reinvestContext.targets.filter((e) => e.id !== entry?.id))
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <h3 className="text-white self-center pr-5">Your targets</h3>
      {reinvestContext.targets.map((entry, key) => (
        <Entry key={key} onRemove={onRemove} entry={entry} />
      ))}
      <AddEntry add={onAdd}></AddEntry>
    </div>
  )
}

function Entry({
  entry,
  permanent,
  onRemove,
}: {
  entry?: ReinvestTarget
  permanent?: boolean
  onRemove?: (entry?: ReinvestTarget) => void
}) {
  const reinvestContext = useContext(ReinvestContext)
  const [hover, setHover] = useState(false)

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="bg-light h-12 flex flex-row rounded-lg w-full items-center px-2 py-4">
        <Dropdown
          items={[{ label: 'DFI' }, { label: 'BTC' }, { label: 'ETH' }, { label: 'TSLA-DUSD' }]}
          onSelect={(item) => {
            const target = reinvestContext.targets.find((target) => target.id === entry?.id)
            if (target) target.name = item.label
            reinvestContext.update(reinvestContext.targets)
          }}
        />
        <p className="truncate">{entry?.id}</p>
      </div>
      <button
        onClick={() => {
          if (onRemove) onRemove(entry)
        }}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        hidden={permanent}
      >
        <FontAwesomeIcon icon={faTrashCan} size={'xl'} color={hover ? '#ff00af' : '#222'} />
      </button>
    </div>
  )
}

function AddEntry({ add }: { add: () => void }) {
  return (
    <div className="w-full pr-9">
      <div className="outline-dashed outline-light outline-2 h-12 flex flex-row rounded-lg items-center py-4">
        <button className="w-full" onClick={add}>
          <FontAwesomeIcon icon={faCirclePlus} size={'xl'} color={'#ff00af'} />
        </button>
      </div>
    </div>
  )
}
