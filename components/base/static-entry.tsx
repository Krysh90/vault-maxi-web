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
  type: 'info' | 'warn' | 'add' | 'wrapper' | 'wrapper-between'
  text?: string
  add?: () => void
  variableHeight?: boolean
}

export function StaticEntry({ type, text, add, variableHeight, children }: StaticEntryProps): JSX.Element {
  function backgroundColor(): string {
    switch (type) {
      case 'info':
        return 'bg-info-base'
      case 'warn':
        return 'bg-warn-base'
      case 'wrapper':
      case 'wrapper-between':
        return 'bg-light'
      default:
        return ''
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

  function iconColor(): string {
    switch (type) {
      case 'info':
        return '#40869b'
      case 'warn':
        return '#cca300'
      case 'add':
        return '#ff00af'
      default:
        return '#fff'
    }
  }

  function outline(): string {
    switch (type) {
      case 'info':
      case 'warn':
        return 'outline outline-light outline-1'
      case 'add':
        return 'outline-dashed outline-light outline-2'
      default:
        return ''
    }
  }

  const defaultConfig = 'gap-4 md:flex-nowrap md:h-12'
  const variableHeightConfig = 'gap-4 md:flex-nowrap'
  const height = variableHeight ? variableHeightConfig : defaultConfig
  const heightConfig = type !== 'add' ? height : ''
  const paddingRight = variableHeight || type === 'wrapper' || type === 'wrapper-between' ? '' : 'pr-9'
  const wrapperConfig =
    type === 'wrapper' ? 'justify-center flex-wrap' : type === 'wrapper-between' ? 'justify-between flex-wrap' : ''

  return (
    <div className={`w-full ${paddingRight}`}>
      <div
        className={`${backgroundColor()} ${outline()} flex flex-row rounded-lg items-center py-4 px-2 ${heightConfig} ${wrapperConfig}`}
      >
        {type === 'wrapper' || type === 'wrapper-between' ? (
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
