import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import ThemedInput from '../base/themed-input'

export interface ValueChooserProps {
  value: number
  onChange: (value: number) => void
  boundary: { min: number; max: number }
  special: { on: number; text: string }
}

export default function ValueChooser({ value, onChange, boundary, special }: ValueChooserProps) {
  const [isEdit, setIsEdit] = useState(false)

  const decrease = () => {
    if (value > boundary.min) onChange(value - 1)
  }

  const increase = () => {
    if (value < boundary.max) onChange(value + 1)
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
            if (value >= boundary.min && value <= boundary.max) onChange(value)
          }}
          onSubmit={() => setIsEdit(false)}
        />
      ) : (
        <>
          <button className="h-6 w-6" onClick={decrease}>
            <FontAwesomeIcon icon={faMinus} size={'sm'} />
          </button>
          <button onClick={() => setIsEdit(true)}>
            {special.on === value ? <p>{special.text}</p> : <p>{value}%</p>}
          </button>
          <button className="h-6 w-6" onClick={increase}>
            <FontAwesomeIcon icon={faPlus} size={'sm'} />
          </button>
        </>
      )}
    </div>
  )
}
