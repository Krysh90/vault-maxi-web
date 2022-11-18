import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HTMLInputTypeAttribute } from 'react'

export interface ThemedInputProps {
  className: string
  type: HTMLInputTypeAttribute
  enterKeyHint: 'search' | 'enter' | 'done' | 'go' | 'next' | 'previous' | 'send' | undefined
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function ThemedInput({ className, type, enterKeyHint, onChange, onSubmit }: ThemedInputProps) {
  return (
    <>
      <input
        type={type}
        enterKeyHint={enterKeyHint}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && onSubmit()}
        onSubmit={() => onSubmit()}
        autoFocus={true}
        className={`${className} text-white focus:outline-none`}
      />
      <button className="h-6 w-6" onClick={() => onSubmit()}>
        <FontAwesomeIcon icon={faCheck} size={'sm'} />
      </button>
    </>
  )
}
