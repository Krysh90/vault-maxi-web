import { StaticImageData } from 'next/image'

export interface TeamDto {
  name: string
  image: StaticImageData
  imageAlt: string
  description: string[]
  handles: HandleDto[]
}

export enum HandleType {
  TWITTER,
  GITHUB,
}

export interface HandleDto {
  type: HandleType
  url: string
}
