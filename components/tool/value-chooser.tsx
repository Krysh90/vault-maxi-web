import { faMinus, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { ReinvestTarget } from '../../dtos/reinvest-target.dto'

export interface ValueChooserProps {
  boundary: { min: number; max: number }
  entry?: ReinvestTarget
  onChange: (value: number) => void
}

export default function ValueChooser({ entry, onChange, boundary }: ValueChooserProps) {
  const [isEdit, setIsEdit] = useState(false)

  const decrease = () => {
    if (entry && entry.value > boundary.min) onChange(entry.value - 1)
  }

  const increase = () => {
    if (entry && entry.value < boundary.max) onChange(entry.value + 1)
  }

  return (
    <div className="flex flex-row items-center gap-2">
      {isEdit ? (
        <>
          <input
            type={'number'}
            enterKeyHint={'done'}
            onChange={(e) => {
              const value = +e.target.value
              if (value > 0 && value <= 100) onChange(value)
            }}
            onKeyUp={(e) => e.key === 'Enter' && setIsEdit(false)}
            onSubmit={() => setIsEdit(false)}
            autoFocus={true}
            className="text-white bg-light w-8 ml-8 focus:outline-none"
          />
          <button className="h-6 w-6" onClick={() => setIsEdit(false)}>
            <FontAwesomeIcon icon={faCheck} size={'sm'} />
          </button>
        </>
      ) : (
        <>
          <button className="h-6 w-6" onClick={decrease}>
            <FontAwesomeIcon icon={faMinus} size={'sm'} />
          </button>
          <button onClick={() => setIsEdit(true)}>
            <p>{entry?.value}%</p>
          </button>
          <button className="h-6 w-6" onClick={increase}>
            <FontAwesomeIcon icon={faPlus} size={'sm'} />
          </button>
        </>
      )}
    </div>
  )
}
