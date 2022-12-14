import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image, { StaticImageData } from 'next/future/image'
import Link from 'next/link'
import { LinkDto } from '../../dtos/link.dto'

export interface CardItem {
  index: number
  title: string
  description: string
  image?: StaticImageData
  imageAlt?: string
  icon?: { definition: IconDefinition; color: string; size: SizeProp }
  specialIcon?: () => JSX.Element
  links: LinkDto[]
}

export interface CardProps {
  item: CardItem
}

export default function Card({ item }: CardProps): JSX.Element {
  return (
    <div key={item.index} className="flex flex-col w-full items-start bg-light rounded-lg px-4 py-6 lg:w-96 lg:h-56">
      {item.image && (
        <div className="relative m-auto w-full">
          <Image
            className="absolute top-0 right-0 opacity-20"
            src={item.image}
            alt={item.imageAlt ?? ''}
            height={80}
            width={80}
          />
        </div>
      )}
      {item.icon && (
        <div className="relative ml-auto w-20">
          <FontAwesomeIcon
            className="absolute inset-y-0"
            icon={item.icon.definition}
            color={item.icon.color}
            size={item.icon.size}
          />
        </div>
      )}
      {item.specialIcon && item.specialIcon()}
      <h3>{item.title}</h3>
      <p className={item.image || item.icon || item.specialIcon ? 'w-3/5' : ''}>{item.description}</p>
      <div className="flex flex-col pt-4 mt-auto">
        {item.links.map((link, linkIndex) => (
          <Link key={linkIndex} href={link.url}>
            <a className="hover:text-main ease-in duration-100">{link.display} &rarr;</a>
          </Link>
        ))}
      </div>
    </div>
  )
}
