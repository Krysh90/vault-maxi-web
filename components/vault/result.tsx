import BigNumber from 'bignumber.js'
import { useVaultContext } from '../../contexts/vault.context'
import DonutChart from '../base/donut-chart'
import { colorBasedOn } from '../../lib/colors.lib'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useVaultState } from '../../hooks/vault-state.hook'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export function Result(): JSX.Element {
  const {
    vaultCollateralTokens,
    vaultLoanTokens,
    currentRatio,
    nextRatio,
    vaultScheme,
    collateralValue,
    loanValue,
    getAmount,
    takeLoanRules,
    withdrawCollateralRules,
  } = useVaultContext()
  const { state, getColorForVaultState, getIconForVaultState } = useVaultState()

  const general = [
    { id: 0, title: 'Vault state', value: `${state}` },
    { id: 1, title: 'Minimum collateral ratio', value: `${vaultScheme}%` },
    { id: 2, title: 'Current collateral ratio', value: `${currentRatio}%` },
    { id: 3, title: 'Next collateral ratio', value: `${nextRatio}%` },
  ]

  const charts = [
    {
      id: 0,
      title: 'Collateral',
      data: {
        labels: vaultCollateralTokens.map((token) => token.token.symbol),
        datasets: [
          {
            data: vaultCollateralTokens.map((token) =>
              new BigNumber(token.activePrice?.active?.amount ?? 1).multipliedBy(getAmount(token)).toNumber(),
            ),
            backgroundColor: vaultCollateralTokens.map((token) => colorBasedOn(token.token.symbol)),
            hoverOffset: 4,
          },
        ],
      },
    },
    {
      id: 1,
      title: 'Loan',
      data: {
        labels: vaultLoanTokens.map((token) => token.token.symbol),
        datasets: [
          {
            data: vaultLoanTokens.map((token) =>
              new BigNumber(token.activePrice?.active?.amount ?? 1).multipliedBy(getAmount(token)).toNumber(),
            ),
            backgroundColor: vaultLoanTokens.map((token) => colorBasedOn(token.token.symbol)),
            hoverOffset: 4,
          },
        ],
      },
    },
  ]

  const collateralChange = new BigNumber(loanValue)
    .multipliedBy(Number(vaultScheme) / 100)
    .minus(collateralValue)
    .abs()
  const collateralChangePercentage = collateralChange.dividedBy(collateralValue).multipliedBy(100)

  const loanChange = new BigNumber(collateralValue)
    .dividedBy(Number(vaultScheme) / 100)
    .minus(loanValue)
    .abs()
  const loanChangePercentage = loanChange.dividedBy(loanValue).multipliedBy(100)

  const liquidation =
    currentRatio < Number(vaultScheme)
      ? [
          { id: 0, title: 'Vault would be in liquidation', absolute: '', percentage: '' },
          {
            id: 1,
            title: '- either increase collateral by',
            absolute: `${collateralChange.decimalPlaces(2).toString()}$`,
            percentage: `${collateralChangePercentage.decimalPlaces(2).toString()}%`,
          },
          {
            id: 2,
            title: '- or decrease loan by',
            absolute: `${loanChange.decimalPlaces(2).toString()}$`,
            percentage: `${loanChangePercentage.decimalPlaces(2).toString()}%`,
          },
        ]
      : [
          { id: 0, title: 'Vault is active, it would liquidate if', absolute: '', percentage: '' },
          {
            id: 1,
            title: '- either collateral decreases by',
            absolute: `${collateralChange.decimalPlaces(2).toString()}$`,
            percentage: `${collateralChangePercentage.decimalPlaces(2).toString()}%`,
          },
          {
            id: 2,
            title: '- or loans increase by',
            absolute: `${loanChange.decimalPlaces(2).toString()}$`,
            percentage: `${loanChangePercentage.decimalPlaces(2).toString()}%`,
          },
        ]

  const isWithdrawPossible = !Array.from(withdrawCollateralRules.values()).every((value) => value === false)

  return (
    <div>
      {vaultCollateralTokens.length === 0 ? (
        <>
          <h3>Result</h3>
          <p className="text-code">Please add tokens to your collateral</p>
        </>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row justify-evenly">
            {charts.map((entry) => (
              <div key={entry.id} className="flex flex-col gap-2 items-center">
                <p>{entry.title}</p>
                <div className="relative">
                  <DonutChart chartData={entry.data} small />
                </div>
              </div>
            ))}
          </div>
          <h3>Rules</h3>
          <h4>Take loans</h4>
          {Array.from(takeLoanRules.entries()).map(([rule, isMet], index) => (
            <div key={index} className="flex flex-row justify-between">
              <p>- {rule}</p>
              {isMet && <FontAwesomeIcon icon={faCheckCircle} size="sm" color="#32D74B" />}
            </div>
          ))}
          <h4>Withdraw collateral</h4>
          <div className="flex flex-row justify-between">
            <p style={{ color: isWithdrawPossible ? '#32D74B' : '#FF453A' }}>
              {isWithdrawPossible
                ? 'You can withdraw as long as at least one rule is checked'
                : 'At least one rule must be checked to withdraw collateral'}
            </p>
          </div>
          {Array.from(withdrawCollateralRules.entries()).map(([rule, isMet], index) => (
            <div key={index} className="flex flex-row justify-between">
              <p>- {rule}</p>
              {isMet && <FontAwesomeIcon icon={faCheckCircle} size="sm" color="#32D74B" />}
            </div>
          ))}
          <h3>Infos</h3>
          {general.map((entry) => {
            const icon = getIconForVaultState(entry.value)
            return (
              <div key={entry.id} className="flex flex-row justify-between">
                <p>{entry.title}</p>
                <div className="flex flex-row gap-2 items-center">
                  <p style={{ color: getColorForVaultState(entry.value) }}>{entry.value}</p>
                  {icon && <FontAwesomeIcon icon={icon} size="sm" color={getColorForVaultState(entry.value)} />}
                </div>
              </div>
            )
          })}
          {liquidation.length > 0 && (
            <>
              <h4>Liquidation infos</h4>
              {liquidation.map((entry) => (
                <div key={entry.id} className="flex flex-row justify-between">
                  <p>{entry.title}</p>
                  <div className="flex flex-row">
                    <p>{entry.absolute}</p>
                    <p className="w-24 text-right">{entry.percentage}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
