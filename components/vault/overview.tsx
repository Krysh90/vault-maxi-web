import { VaultScheme, useVaultContext } from '../../contexts/vault.context'
import { useVaultState } from '../../hooks/vault-state.hook'
import Selection from '../base/selection'
import { Result } from './result'
import { TokenDropZone } from './token-drop-zone'

export function VaultOverview(): JSX.Element {
  const { vaultScheme, setVaultScheme } = useVaultContext()
  const { state, getColorForVaultState } = useVaultState()

  return (
    <div className="w-full lg:w-half flex flex-col gap-4">
      <div className="p-2 w-full border rounded-lg" style={{ borderColor: getColorForVaultState(state) }}>
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-4xl text-white">Your vault</h1>
          <Selection
            items={Object.values(VaultScheme).map((value) => `${value}%`)}
            onChanged={(value) => setVaultScheme(value.replace('%', '') as VaultScheme)}
            selectedItem={`${vaultScheme}%`}
          />
        </div>
        <div className="flex flex-col p-4 gap-2">
          <TokenDropZone type="Collateral" />
          <TokenDropZone type="Loan" />
        </div>
      </div>
      <Result />
    </div>
  )
}
