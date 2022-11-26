import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { StaticImageData } from 'next/image'
import { LinkDto } from './link.dto'

export interface FeatureDto {
  name: string
  image?: StaticImageData
  imageAlt?: string
  icon?: {
    definition: IconDefinition
    color: string
    size: SizeProp
  }
  description: string
  links: LinkDto[]
}
