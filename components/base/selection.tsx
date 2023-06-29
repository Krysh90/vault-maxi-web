import { useEffect } from 'react'

interface SelectionButtonProps {
  item: string
  isSelected: boolean
  onClick: () => void
  big?: boolean
  nonSelectedBg?: string
}

function SelectionButton({ item, isSelected, onClick, big, nonSelectedBg }: SelectionButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${big ? 'rounded-md flex-grow' : 'gap-2 rounded-lg items-center'} ${
        isSelected ? 'bg-main' : nonSelectedBg ?? 'bg-light'
      }`}
    >
      <p className={big ? 'text-center' : 'text-white px-2 py-1 text-sm'}>{item}</p>
    </button>
  )
}

export interface SelectionProps {
  items: string[]
  onChanged: (item: string) => void
  selectedItem: string
  border?: boolean
}

export default function Selection({ items, onChanged, selectedItem, border }: SelectionProps): JSX.Element {
  function updateTo(item: string) {
    onChanged(item)
  }

  return (
    <div
      className={'flex flex-row gap-2 '.concat(
        border ? 'justify-evenly p-1 rounded-lg border border-white' : 'justify-start',
      )}
    >
      {items.map((item, index) => (
        <SelectionButton
          key={index}
          item={item}
          isSelected={item === selectedItem}
          onClick={() => updateTo(item)}
          big={border}
          nonSelectedBg={border ? 'bg-none' : 'bg-light'}
        />
      ))}
    </div>
  )
}
