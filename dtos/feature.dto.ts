import { StaticImageData } from 'next/image'
import { LinkDto } from './link.dto'

export interface FeatureDto {
  name: string
  image?: StaticImageData
  imageAlt: string
  description: string
  links: LinkDto[]
}
