import { useVaultContext } from '../../contexts/vault.context'

export function Result(): JSX.Element {
  const { vaultCollateralTokens, currentRatio, vaultScheme } = useVaultContext()

  return (
    <div>
      <h3>Result</h3>
      {vaultCollateralTokens.length === 0 ? (
        <p className="text-code">Please add tokens to your collateral</p>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row justify-between">
            <p>Minimum collateral ratio</p>
            <p>{vaultScheme}%</p>
          </div>
          <div className="flex flex-row justify-between">
            <p>Current collateral ratio</p>
            <p>{currentRatio}%</p>
          </div>
        </div>
      )}
    </div>
  )
}
