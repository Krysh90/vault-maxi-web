import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export interface ThemedIconButton {
  className?: string
  icon: IconDefinition
  color: string
  hoverColor?: string
  hidden?: boolean
  onClick: () => void
  useCheckmarkAnimation?: boolean
}

export function ThemedIconButton({
  className,
  icon,
  color,
  hoverColor,
  hidden,
  onClick,
  useCheckmarkAnimation,
}: ThemedIconButton) {
  const [hover, setHover] = useState(false)
  const [changeToCheckmark, setChangeToCheckmark] = useState(false)

  return (
    <button
      className={className}
      onClick={() => {
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
    >
      <FontAwesomeIcon
        icon={changeToCheckmark ? faCheck : icon}
        size={changeToCheckmark ? 'lg' : 'xl'}
        color={(hoverColor && hover) || changeToCheckmark ? hoverColor : color}
      />
    </button>
  )
}
