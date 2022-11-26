import { faCheck, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export interface ThemedIconButtonProps {
  className?: string
  icon: IconDefinition
  color: string
  hoverColor?: string
  hidden?: boolean
  onClick: () => void
  useCheckmarkAnimation?: boolean
  disabled?: boolean
}

export function ThemedIconButton({
  className,
  icon,
  color,
  hoverColor,
  hidden,
  onClick,
  useCheckmarkAnimation,
  disabled,
}: ThemedIconButtonProps): JSX.Element {
  const [hover, setHover] = useState(false)
  const [changeToCheckmark, setChangeToCheckmark] = useState(false)

  function receiveColor(): string | undefined {
    if (disabled) return '#333'
    return (hoverColor && hover) || changeToCheckmark ? hoverColor : color
  }

  return (
    <button
      className={className}
      onClick={() => {
        if (disabled) return
        onClick()
        if (useCheckmarkAnimation) {
          setChangeToCheckmark(true)
          setTimeout(() => {
            setChangeToCheckmark(false)
            setHover(false)
          }, 1000)
        }
      }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      hidden={hidden}
      disabled={disabled}
    >
      <FontAwesomeIcon
        icon={changeToCheckmark ? faCheck : icon}
        size={changeToCheckmark ? 'lg' : 'xl'}
        color={receiveColor()}
      />
    </button>
  )
}
