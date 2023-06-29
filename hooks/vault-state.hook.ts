import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { useVaultContext } from '../contexts/vault.context'
import { faCheckCircle, faExclamationCircle, faWarning } from '@fortawesome/free-solid-svg-icons'

export type VaultState = 'inactive' | 'safe' | 'at risk' | 'in liquidation' | 'invalid'

interface VaultStateHook {
  state: VaultState
  getColorForVaultState: (value: string) => string
  getIconForVaultState: (value: string) => IconProp | undefined
}

export function useVaultState(): VaultStateHook {
  const { vaultScheme, currentRatio, vaultCollateralTokens, vaultLoanTokens, vaultRules } = useVaultContext()

  function getVaultState(): VaultState {
    if (vaultCollateralTokens.length === 0 || vaultLoanTokens.length === 0) {
      return 'inactive'
    }
    if (!Array.from(vaultRules.values()).includes(true)) return 'invalid'
    const scheme = Number(vaultScheme)
    if (currentRatio < scheme) {
      return 'in liquidation'
    } else if (currentRatio < scheme + (2 * scheme) / 10) {
      return 'at risk'
    } else {
      return 'safe'
    }
  }

  function getColorForVaultState(value: string): string {
    switch (value) {
      case 'inactive':
        return '#CCCCCC'
      case 'safe':
        return '#32D74B'
      case 'at risk':
        return '#FF9F0A'
      case 'in liquidation':
      case 'invalid':
        return '#FF453A'
      default:
        return '#FFFFFF'
    }
  }

  function getIconForVaultState(value: string): IconProp | undefined {
    switch (value) {
      case 'safe':
        return faCheckCircle
      case 'at risk':
        return faWarning
      case 'in liquidation':
      case 'invalid':
        return faExclamationCircle
      default:
        return undefined
    }
  }

  return { state: getVaultState(), getColorForVaultState, getIconForVaultState }
}
