import { useState } from 'react'

// TODO Krysh: do we need a selection indicator? I guess not keep it until decided
function SelectedIndicator() {
  return (
    <span className="text-main absolute inset-y-0 right-0 flex items-center pr-4">
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  )
}

function DropDownIndicator() {
  return (
    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  )
}

function ItemDisplay({ item }: { item?: Item }) {
  return (
    <span className="flex items-center">
      <div className="bg-main rounded-full h-8 w-8" />
      <span className="ml-3 block truncate">{item?.label ?? 'Select a coin'}</span>
    </span>
  )
}

interface Item {
  label: string
}

export default function DropDown() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item>()

  const items = [{ label: 'DFI' }, { label: 'BTC' }, { label: 'ETH' }, { label: 'TSLA-DUSD' }]

  return (
    <div className="relative w-72">
      <button
        type="button"
        className="relative w-full cursor-default py-2 pl-3 pr-10 text-left sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ItemDisplay item={selectedItem} />
        <DropDownIndicator />
      </button>

      <ul
        className="absolute z-10 max-h-32 w-full overflow-auto text-base sm:text-sm bg-dark rounded-b-md"
        tabIndex={-1}
        hidden={!isOpen}
      >
        {items.map((item, key) => (
          <li className="text-white relative cursor-default border-t-white select-none py-2 px-3" key={key}>
            <button
              className="min-w-full min-h-full"
              onClick={() => {
                setSelectedItem(item)
                setIsOpen(false)
              }}
            >
              <ItemDisplay item={item} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}