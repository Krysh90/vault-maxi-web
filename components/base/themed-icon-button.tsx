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
}

export function ThemedIconButton({ className, icon, color, hoverColor, hidden, onClick }: ThemedIconButton) {
  const [hover, setHover] = useState(false)

  return (
    <button
      className={className}
      onClick={onClick}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      hidden={hidden}
    >
      <FontAwesomeIcon icon={icon} size={'xl'} color={hoverColor && hover ? hoverColor : color} />
    </button>
  )
}
