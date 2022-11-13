import React, { useState } from 'react'
import { ReinvestTarget } from '../../dtos/reinvest-target.dto'
import { faCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import uuid from 'react-uuid'
import DropDown from '../base/dropdown'

export interface ReinvestEntriesProps {
  entries: ReinvestTarget[]
  setEntries: (entries: ReinvestTarget[]) => void
}

export default function ReinvestEntries({ entries, setEntries }: ReinvestEntriesProps) {
  const onAdd = (): void => {
    setEntries(entries.concat({ id: uuid(), value: 20, name: 'BTC' }))
  }

  const onRemove = (entry?: ReinvestTarget): void => {
    setEntries(entries.filter((e) => e.id !== entry?.id))
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg">
      <h3 className="text-white self-center pr-5">Your targets</h3>
      {entries.map((entry, key) => (
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
  const [hover, setHover] = useState(false)

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="bg-light h-12 flex flex-row rounded-lg w-full items-center px-2 py-4">
        <DropDown />
        <p>{entry?.id}</p>
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
