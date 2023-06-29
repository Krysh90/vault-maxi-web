import { useVaultContext } from '../../contexts/vault.context'
import { TokenContainer } from './tokens/container'

export function LoanTokens(): JSX.Element {
  const { loanTokens } = useVaultContext()
  return <TokenContainer title="Loan tokens" tokens={loanTokens} type="Loan" />
}
