import React, { useContext } from 'react'
import { faCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropdown from '../base/dropdown'
import { ReinvestContext } from '../../contexts/reinvest.context'
import ValueChooser from './value-chooser'
import TargetInput from './target-input'
import { getAssetIcon } from '../../defiscan'
import { ThemedIconButton } from '../base/themed-icon-button'
import { Reinvest } from '../../entities/reinvest.entity'

export interface ReinvestEntriesProps {}

export default function ReinvestEntries({}: ReinvestEntriesProps) {
  const reinvestContext = useContext(ReinvestContext)

  const onAdd = (): void => {
    reinvestContext.update(reinvestContext.entries.concat(Reinvest.create()))
  }

  const onRemove = (entry?: Reinvest): void => {
    reinvestContext.update(reinvestContext.entries.filter((e) => e.id !== entry?.id))
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <h3 className="text-white self-center pr-5">Your targets</h3>
      {reinvestContext.entries.map((entry, key) => (
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
  entry?: Reinvest
  permanent?: boolean
  onRemove?: (entry?: Reinvest) => void
}) {
  const reinvestContext = useContext(ReinvestContext)

  const update = (values: Partial<Reinvest>) => {
    entry?.update(values)
    reinvestContext.updated()
  }

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="bg-light flex flex-row flex-wrap justify-center rounded-lg w-full items-center px-2 py-4 gap-4 md:flex-nowrap md:h-12">
        <Dropdown
          items={[{ label: 'DFI' }, { label: 'BTC' }, { label: 'ETH' }, { label: 'TSLA-DUSD' }]}
          onSelect={(item) => update({ token: item.label })}
          preselection={entry && entry.token ? { label: entry.token } : undefined}
          getIcon={(token) => getAssetIcon(token)({ height: 24, width: 24 })}
        />
        <ValueChooser
          value={entry?.value ?? 0}
          boundary={{ min: 0, max: 100 }}
          onChange={(value) => update({ value })}
        />
        <TargetInput entry={entry} onChange={(target) => update({ target })} />
      </div>
      <ThemedIconButton
        icon={faTrashCan}
        color="#222"
        hoverColor="#ff00af"
        onClick={() => {
          if (onRemove) onRemove(entry)
        }}
        hidden={permanent}
      />
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
