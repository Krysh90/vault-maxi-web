import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faQuestion,
  faCirclePlus,
  faTriangleExclamation,
  faCircleInfo,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { PropsWithChildren } from 'react'

interface StaticEntryProps extends PropsWithChildren {
  type: 'info' | 'warn' | 'add' | 'wrapper'
  text?: string
  add?: () => void
  variableHeight?: boolean
}

export function StaticEntry({ type, text, add, variableHeight, children }: StaticEntryProps): JSX.Element {
  function backgroundColor(): string | undefined {
    switch (type) {
      case 'info':
        return 'bg-info-base'
      case 'warn':
        return 'bg-warn-base'
      case 'wrapper':
        return 'bg-light'
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
      default:
        return faQuestion
    }
  }

  function iconColor(): string | undefined {
    switch (type) {
      case 'info':
        return '#40869b'
      case 'warn':
        return '#cca300'
      case 'add':
        return '#ff00af'
    }
  }

  function outline(): string | undefined {
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
  const height = variableHeight ? variableHeightConfig : defaultConfig
  const heightConfig = type !== 'add' ? height : ''
  const paddingRight = variableHeight || type === 'wrapper' ? '' : 'pr-9'
  const wrapperConfig = type === 'wrapper' ? 'justify-center flex-wrap' : ''

  return (
    <div className={`w-full ${paddingRight}`}>
      <div
        className={`${backgroundColor()} ${outline()} flex flex-row rounded-lg items-center py-4 px-2 ${heightConfig} ${wrapperConfig}`}
      >
        {type === 'wrapper' ? (
          children
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
