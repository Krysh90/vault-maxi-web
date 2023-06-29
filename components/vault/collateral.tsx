import { useVaultContext } from '../../contexts/vault.context'
import { TokenContainer } from './tokens/container'

export function CollateralTokens(): JSX.Element {
  const { collateralTokens } = useVaultContext()
  return <TokenContainer title="Collateral tokens" tokens={collateralTokens} type="Collateral" />
}
