import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import ThemedInput from '../base/themed-input'
import BigNumber from 'bignumber.js'

export interface ValueChooserProps {
  value: number
  onChange: (value: number) => void
  boundary: { min: number; max: number }
  special?: { on: number; text: string }
  postfix?: string
  step?: number
  big?: boolean
}

export default function ValueChooser({
  value,
  postfix = '%',
  step = 1,
  onChange,
  boundary,
  special,
  big,
}: ValueChooserProps): JSX.Element {
  const [isEdit, setIsEdit] = useState(false)

  const decrease = () => {
    onChange(new BigNumber(value - step > boundary.min ? value - step : boundary.min).decimalPlaces(2).toNumber())
  }

  const increase = () => {
    onChange(new BigNumber(value + step > boundary.min ? value + step : boundary.max).decimalPlaces(2).toNumber())
  }

  return (
    <div className={`flex flex-row items-center ${big ? 'w-48' : 'w-24'} justify-between`}>
      {isEdit ? (
        <ThemedInput
          className={`bg-light ${big ? 'w-full' : 'w-8'} ml-8`}
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
          <button className="w-full" onClick={() => setIsEdit(true)}>
            {special?.on === value ? (
              <p>{special.text}</p>
            ) : (
              <p>
                {value}
                {postfix}
              </p>
            )}
          </button>
          <button className="h-6 w-6" onClick={increase}>
            <FontAwesomeIcon icon={faPlus} size={'sm'} />
          </button>
        </>
      )}
    </div>
  )
}
