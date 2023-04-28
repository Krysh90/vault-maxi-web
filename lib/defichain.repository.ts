import { faMoneyBillTransfer, faBridge } from '@fortawesome/free-solid-svg-icons'
import { CardItemDto } from '../dtos/card-item.dto'

export class DefichainRepository {
  static all(): CardItemDto[] {
    return [realYield, quantum]
  }
}

const realYield: CardItemDto = {
  name: 'Real yield',
  description: 'A display of real yield generated by defichain',
  icon: { definition: faMoneyBillTransfer, color: '#666', size: '4x' },
  links: [{ url: '/defichain/real-yield', display: 'Open statistics' }],
}

const quantum: CardItemDto = {
  name: 'Quantum',
  description: 'Display of statistics about quantum bridge',
  icon: { definition: faBridge, color: '#666', size: '4x' },
  links: [{ url: '/defichain/quantum', display: 'Open statistics' }],
}