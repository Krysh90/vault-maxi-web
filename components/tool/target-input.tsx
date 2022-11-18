import { faWallet, faVault } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { ReinvestTarget, ReinvestTargetType } from '../../dtos/reinvest-target.dto'
import ThemedInput from '../base/themed-input'

export interface TargetInputProps {
  entry?: ReinvestTarget
  onChange: (value: string) => void
}

export default function TargetInput({ entry, onChange }: TargetInputProps) {
  const [isEdit, setIsEdit] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)

  useEffect(() => {
    if (entry?.target.value) setIsInvalid(!entry?.target.isValid ?? false)
  }, [entry, entry?.target.value])

  const shortDisplay = (value?: string): string | undefined => {
    const visibleChars = 5
    return value ? `${value.slice(0, visibleChars)}...${value.slice(value.length - visibleChars)}` : undefined
  }

  return (
    <div
      className={`flex flex-row flex-grow items-center justify-between bg-dark rounded-md h-10 ${
        isInvalid ? 'border border-invalid' : ''
      }`}
    >
      <FontAwesomeIcon
        icon={entry?.target.type === ReinvestTargetType.VAULT ? faVault : faWallet}
        size={'lg'}
        className="px-3 py-2"
      />
      {isEdit ? (
        <ThemedInput
          type="text"
          enterKeyHint="done"
          className="bg-dark grow"
          onChange={onChange}
          onSubmit={() => setIsEdit(false)}
        />
      ) : (
        <button className="w-full" onClick={() => setIsEdit(true)}>
          {shortDisplay(entry?.target.value) ?? 'enter address or vault'}
        </button>
      )}
    </div>
  )
}
