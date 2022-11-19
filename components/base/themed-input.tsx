import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HTMLInputTypeAttribute, useState } from 'react'

export interface ThemedInputProps {
  className: string
  value: string
  type: HTMLInputTypeAttribute
  enterKeyHint: 'search' | 'enter' | 'done' | 'go' | 'next' | 'previous' | 'send' | undefined
  onChange: (value: string) => void
  onSubmit: () => void
}

function CustomInput({ className, value, type, enterKeyHint, onChange, onSubmit }: ThemedInputProps) {
  const [currentValue, setCurrentValue] = useState(value)

  return (
    <input
      value={currentValue}
      type={type}
      enterKeyHint={enterKeyHint}
      onChange={(e) => {
        const value = e.target.value
        onChange(value)
        setCurrentValue(value)
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          onChange(currentValue)
          onSubmit()
        }
      }}
      onSubmit={() => onSubmit()}
      autoFocus={true}
      className={`${className} text-white focus:outline-none`}
    />
  )
}

export default function ThemedInput({ className, value, type, enterKeyHint, onChange, onSubmit }: ThemedInputProps) {
  return (
    <>
      <CustomInput
        value={value}
        type={type}
        enterKeyHint={enterKeyHint}
        onChange={onChange}
        onSubmit={onSubmit}
        className={className}
      />
      <button className="h-6 w-6" onClick={() => onSubmit()}>
        <FontAwesomeIcon icon={faCheck} size={'sm'} />
      </button>
    </>
  )
}
