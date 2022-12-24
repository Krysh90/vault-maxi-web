import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ThemedSearchProps {
  onChange: (value: string) => void
}

export default function ThemedSearch({ onChange }: ThemedSearchProps): JSX.Element {
  return (
    <div className="bg-light rounded-lg h-12 w-full px-2 py-1 md:w-72">
      <div className="bg-dark rounded-lg w-full h-full flex flex-row items-center gap-2 px-2">
        <FontAwesomeIcon className="px-2" icon={faSearch} size={'sm'} />
        <input
          type="text"
          placeholder="Search"
          className="text-white focus:outline-none bg-dark w-full"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
