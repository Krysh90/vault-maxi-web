import { StaticImageData } from 'next/image'

export interface FeatureDto {
  name: string
  image?: StaticImageData
  imageAlt: string
  description: string
  links: FeatureLinksDto[]
}

export interface FeatureLinksDto {
  url: string
  display: string
}
