import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faTriangleExclamation, faCircleInfo, IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface StaticEntryProps {
  type: 'info' | 'warn' | 'add'
  text?: string
  add?: () => void
  variableHeight?: boolean
}

export function StaticEntry({ type, text, add, variableHeight }: StaticEntryProps): JSX.Element {
  function backgroundColor(): string | undefined {
    switch (type) {
      case 'info':
        return 'bg-info-base'
      case 'warn':
        return 'bg-warn-base'
    }
  }

  function icon(): IconDefinition {
    switch (type) {
      case 'info':
        return faCircleInfo
      case 'warn':
        return faTriangleExclamation
      case 'add':
        return faCirclePlus
    }
  }

  function iconColor(): string {
    switch (type) {
      case 'info':
        return '#40869b'
      case 'warn':
        return '#cca300'
      case 'add':
        return '#ff00af'
    }
  }

  function outline(): string {
    switch (type) {
      case 'info':
      case 'warn':
        return 'outline outline-light outline-1'
      case 'add':
        return 'outline-dashed outline-light outline-2'
    }
  }

  const defaultConfig = 'gap-4 md:flex-nowrap md:h-12'
  const variableHeightConfig = 'gap-4 md:flex-nowrap'

  return (
    <div className="w-full pr-9">
      <div
        className={`${backgroundColor()} ${outline()} flex flex-row rounded-lg items-center py-4 px-2 ${
          type !== 'add' ? (variableHeight ? variableHeightConfig : defaultConfig) : ''
        }`}
      >
        {type === 'add' ? (
          <button className="w-full" onClick={add}>
            <FontAwesomeIcon icon={icon()} size={'xl'} color={iconColor()} />
          </button>
        ) : (
          <>
            <FontAwesomeIcon className="ml-3" icon={icon()} size={'xl'} color={iconColor()} />
            <p className="text-light mx-auto">{text}</p>
          </>
        )}
      </div>
    </div>
  )
}
