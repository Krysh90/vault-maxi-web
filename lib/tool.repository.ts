import { CardItemDto } from '../dtos/card-item.dto'
import { faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons'

export class ToolRepository {
  static all(): CardItemDto[] {
    return [reinvestPattern]
  }
}

const reinvestPattern: CardItemDto = {
  name: 'Reinvest pattern',
  description: 'Generate a reinvest pattern that fits your needs',
  icon: { definition: faCircleDollarToSlot, color: '#666', size: '5x' },
  links: [{ url: '/tool/reinvest-pattern', display: 'Open tool' }],
}
