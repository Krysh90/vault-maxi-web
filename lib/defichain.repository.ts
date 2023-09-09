import { faMoneyBillTransfer, faBridge, faGlobe, faChartSimple, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { CardItemDto } from '../dtos/card-item.dto'

export class DefichainRepository {
  static all(): CardItemDto[] {
    return [realYield, quantum, metaChain, dTokenStats, volumeStats]
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

const metaChain: CardItemDto = {
  name: 'MetaChain',
  description: 'Connect to MetaChain networks',
  icon: { definition: faGlobe, color: '#666', size: '4x' },
  links: [
    { url: '/defichain/meta-chain', display: 'Open page' },
    { url: 'https://defichain.com/de/metachain', display: 'About' },
  ],
}

const dTokenStats: CardItemDto = {
  name: 'dToken Stats',
  description: 'Display of statistics about dTokens and FutureSwap',
  icon: { definition: faChartSimple, color: '#666', size: '4x' },
  links: [{ url: '/defichain/dtoken-stats', display: 'Open page' }],
}

const volumeStats: CardItemDto = {
  name: 'Volume Stats',
  description: 'Display of statistics about DFI volume',
  icon: { definition: faChartLine, color: '#666', size: '4x' },
  links: [{ url: '/defichain/volume', display: 'Open page' }],
}
