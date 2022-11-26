import { ToolDto } from '../dtos/tool.dto'
import { faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons'

export class ToolRepository {
  static all(): ToolDto[] {
    return [reinvestPattern]
  }
}

const reinvestPattern: ToolDto = {
  name: 'Reinvest pattern',
  description: 'Generate a reinvest pattern that fits your needs',
  icon: { definition: faCircleDollarToSlot, color: '#666', size: '5x' },
  links: [{ url: '/tool/reinvest-pattern', display: 'Open tool' }],
}
