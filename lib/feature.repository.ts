import { FeatureDto } from '../dtos/feature.dto'
import imgVaultMaxi from '../public/vault-maxi.png'

export class FeatureRepository {
  static all(): FeatureDto[] {
    return [vaultMaxi, reinvest, commandCenter]
  }
}

const vaultMaxi: FeatureDto = {
  name: 'Vault Maxi',
  image: imgVaultMaxi,
  imageAlt: 'Image of vault-maxi',
  description: 'Vault management bot with automation',
  links: [
    { url: '/feature/vault-maxi/basic', display: 'Basic overview' },
    { url: '/feature/vault-maxi/double-mint', display: 'Double mint strategy' },
    { url: '/feature/vault-maxi/single-mint', display: 'Single mint strategy' },
  ],
}

const commandCenter: FeatureDto = {
  name: 'Command Center',
  image: undefined,
  imageAlt: '',
  description: 'Execute commands via telegram chat',
  links: [{ url: '/feature/command-center', display: 'Read more' }],
}

const reinvest: FeatureDto = {
  name: 'LM Reinvest',
  image: undefined,
  imageAlt: '',
  description: 'Reinvests DFI rewards into a defined liquidity mining pool',
  links: [{ url: '/feature/lm-reinvest', display: 'Read more' }],
}
