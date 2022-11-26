import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { LinkDto } from './link.dto'

export interface ToolDto {
  name: string
  description: string
  icon?: {
    definition: IconDefinition
    color: string
    size: SizeProp
  }
  specialIcon?: () => JSX.Element
  links: LinkDto[]
}
