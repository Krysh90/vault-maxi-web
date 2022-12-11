import { useEffect } from 'react'

interface SelectionButtonProps {
  item: string
  isSelected: boolean
  onClick: () => void
}

function SelectionButton({ item, isSelected, onClick }: SelectionButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-row gap-2 rounded-lg items-center ${isSelected ? 'bg-main' : 'bg-light'}`}
    >
      <p className="text-white px-2 py-1 text-sm">{item}</p>
    </button>
  )
}

export interface SelectionProps {
  items: string[]
  onChanged: (item: string) => void
  selectedItem: string
}

export default function Selection({ items, onChanged, selectedItem }: SelectionProps): JSX.Element {
  function updateTo(item: string) {
    onChanged(item)
  }

  return (
    <div className="flex flex-row gap-2 justify-start">
      {items.map((item, index) => (
        <SelectionButton key={index} item={item} isSelected={item === selectedItem} onClick={() => updateTo(item)} />
      ))}
    </div>
  )
}
