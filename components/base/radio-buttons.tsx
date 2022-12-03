import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

interface RadioButtonRowProps {
  item: RadioButtonItem
  isSelected: boolean
  onClick: () => void
}

function RadioButtonRow({ item, isSelected, onClick }: RadioButtonRowProps): JSX.Element {
  return (
    <button type="button" onClick={onClick} className="flex flex-row gap-2 items-center">
      <FontAwesomeIcon className="pt-0.5" icon={isSelected ? faCircleDot : faCircle} size={'sm'} color="#ff00af" />
      <p>{item.label}</p>
    </button>
  )
}

export interface RadioButtonItem {
  label: string
}

export interface RadioButtonsProps {
  items: RadioButtonItem[]
  onChanged: (index: number) => void
  preselectIndex: number
}

export default function RadioButtons({ items, onChanged, preselectIndex }: RadioButtonsProps): JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState(preselectIndex)

  function updateTo(index: number) {
    setSelectedIndex(index)
    onChanged(index)
  }

  return (
    <div className="flex flex-col gap-2 justify-start">
      {items.map((item, index) => (
        <RadioButtonRow key={index} item={item} isSelected={index === selectedIndex} onClick={() => updateTo(index)} />
      ))}
    </div>
  )
}
