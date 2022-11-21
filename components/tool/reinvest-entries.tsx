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
import { useTokens } from '../../hooks/tokens.hook'
import { Token } from '../../dtos/token.dto'
import { Spinner } from '../base/spinner'

export interface ReinvestEntriesProps {}

export default function ReinvestEntries({}: ReinvestEntriesProps) {
  const reinvestContext = useContext(ReinvestContext)
  const { tokens, isLoading } = useTokens()

  const onAdd = (): void => {
    reinvestContext.update(reinvestContext.entries.concat(Reinvest.create(tokens?.find((t) => t.symbol === 'DFI'))))
  }

  const onRemove = (entry?: Reinvest): void => {
    reinvestContext.update(reinvestContext.entries.filter((e) => e.id !== entry?.id))
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      {isLoading ? (
        <Spinner text="Loading tokens..." />
      ) : (
        <>
          {reinvestContext.entries.map((entry, key) => (
            <Entry tokens={tokens} key={key} onRemove={onRemove} entry={entry} />
          ))}
          <AddEntry add={onAdd}></AddEntry>
        </>
      )}
    </div>
  )
}

function Entry({
  tokens,
  entry,
  permanent,
  onRemove,
}: {
  tokens?: Token[]
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
          items={tokens?.map((t) => ({ label: t.symbol })) ?? []}
          onSelect={(item) => update({ token: tokens?.find((t) => t.symbol === item.label) })}
          preselection={entry && entry.token ? { label: entry.token.symbol } : undefined}
          getIcon={(token) => getAssetIcon(token)({ height: 24, width: 24 })}
        />
        <ValueChooser
          value={entry?.value ?? 0}
          boundary={{ min: 0, max: 100 }}
          onChange={(value) => update({ value })}
          special={{ on: 0, text: 'fill' }}
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
