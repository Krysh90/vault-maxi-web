import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { ReinvestTarget } from '../../dtos/reinvest-target.dto'
import ThemedInput from '../base/themed-input'

export interface ValueChooserProps {
  entry?: ReinvestTarget
  onChange: (value: number) => void
  boundary: { min: number; max: number }
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
    <div className="flex flex-row items-center w-24 justify-between">
      {isEdit ? (
        <ThemedInput
          className="bg-light w-8 ml-8"
          type="number"
          value={''}
          enterKeyHint="done"
          onChange={(s) => {
            const value = +(s ?? '0')
            if (value > 0 && value <= 100) onChange(value)
          }}
          onSubmit={() => setIsEdit(false)}
        />
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
