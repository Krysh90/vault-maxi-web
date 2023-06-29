import { CardItemDto } from '../dtos/card-item.dto'
import { faCircleDollarToSlot, faVault } from '@fortawesome/free-solid-svg-icons'

export class ToolRepository {
  static all(): CardItemDto[] {
    return [reinvestPattern, vaultSim]
  }
}

const reinvestPattern: CardItemDto = {
  name: 'Reinvest pattern',
  description: 'Generate a reinvest pattern that fits your needs',
  icon: { definition: faCircleDollarToSlot, color: '#666', size: '5x' },
  links: [{ url: '/tool/reinvest-pattern', display: 'Open tool' }],
}

const vaultSim: CardItemDto = {
  name: 'Vault simulator',
  description: 'Simulate a vault and receive some data, how it would perform with current defichain values',
  icon: { definition: faVault, color: '#666', size: '4x' },
  links: [{ url: '/tool/vault-simulator', display: 'Open tool' }],
}
