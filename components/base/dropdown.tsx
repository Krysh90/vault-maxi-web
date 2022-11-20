import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

function DropdownIndicator() {
  return (
    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-1">
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

function ItemDisplay({
  item,
  getIcon,
  placeholder,
}: {
  item?: DropdownItem
  getIcon?: (label: string) => JSX.Element
  placeholder?: string
}) {
  return (
    <span className="flex items-center">
      {item && getIcon && getIcon(item.label)}
      <span className="ml-3 block truncate">{item?.label ?? placeholder}</span>
    </span>
  )
}

function DropdownFilter({ onChange }: { onChange: (filter: string) => void }) {
  return (
    <input
      type={'text'}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={true}
      className="bg-dark text-white ml-9 w-32 focus:outline-none"
    />
  )
}

export interface DropdownItem {
  label: string
}

export interface DropdownProps {
  items: DropdownItem[]
  onSelect: (item: DropdownItem) => void
  preselection?: DropdownItem
  getIcon?: (label: string) => JSX.Element
}

export default function Dropdown({ items, onSelect, preselection, getIcon }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DropdownItem>()
  const [filter, setFilter] = useState<string>()

  useEffect(() => {
    if (preselection) setSelectedItem(preselection)
  }, [preselection])

  const select = (item: DropdownItem): void => {
    setSelectedItem(item)
    setFilter(undefined)
    setIsOpen(false)
    onSelect(item)
  }

  return (
    <div className="relative w-full md:w-52">
      <button
        type="button"
        className={`relative w-full cursor-default py-2 pl-3 pr-10 text-left bg-dark ${
          isOpen ? 'rounded-t-md' : 'rounded-md'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <DropdownFilter onChange={setFilter} />
        ) : (
          <ItemDisplay item={selectedItem} getIcon={getIcon} placeholder={'Select a token'} />
        )}
        <DropdownIndicator />
      </button>

      <ul
        className="absolute z-10 max-h-32 w-full overflow-auto text-base bg-dark rounded-b-md"
        tabIndex={-1}
        hidden={!isOpen}
      >
        {items
          .filter((item) => (filter ? item.label.toLowerCase().includes(filter.toLowerCase()) : true))
          .map((item, key) => (
            <li
              className="text-white flex justify-center cursor-default select-none py-3 px-3 hover:bg-light"
              key={key}
            >
              <button
                className="min-w-full min-h-full flex flex-row items-center justify-between"
                onClick={() => {
                  select(item)
                }}
              >
                <ItemDisplay item={item} getIcon={getIcon} />
                {item.label === selectedItem?.label && <FontAwesomeIcon icon={faCheck} size={'sm'} />}
              </button>
            </li>
          ))}
      </ul>
    </div>
  )
}
