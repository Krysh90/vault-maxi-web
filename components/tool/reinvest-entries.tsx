import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Dropdown from '../base/dropdown'
import ValueChooser from './value-chooser'
import TargetInput from './target-input'
import { getAssetIcon } from '../../defiscan'
import { ThemedIconButton } from '../base/themed-icon-button'
import { Reinvest } from '../../entities/reinvest.entity'
import { useTokens } from '../../hooks/tokens.hook'
import { Token } from '../../dtos/token.dto'
import { Spinner } from '../base/spinner'
import { useReinvestContext } from '../../contexts/reinvest.context'
import { StaticEntry } from '../base/static-entry'

export default function ReinvestEntries(): JSX.Element {
  const { entries, updateEntries, showWarning, warning, showInfo, info } = useReinvestContext()
  const { tokens, isLoading } = useTokens()

  const onAdd = (): void => {
    updateEntries(entries.concat(Reinvest.create(tokens?.find((t) => t.symbol === 'DFI'))))
  }

  const onRemove = (entry?: Reinvest): void => {
    updateEntries(entries.filter((e) => e.id !== entry?.id))
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      {isLoading ? (
        <Spinner text="Loading tokens..." />
      ) : (
        <>
          {showWarning && <StaticEntry type="warn" text={warning} />}
          {showInfo && <StaticEntry type="info" text={info} />}
          {entries.map((entry, key) => (
            <Entry tokens={tokens} key={key} onRemove={onRemove} entry={entry} />
          ))}
          <StaticEntry type="add" add={onAdd} />
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
}): JSX.Element {
  const { updated } = useReinvestContext()

  const update = (values: Partial<Reinvest>) => {
    entry?.update(values)
    updated()
  }

  return (
    <div className="flex flex-row gap-4 items-center">
      <StaticEntry type="wrapper">
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
      </StaticEntry>
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
