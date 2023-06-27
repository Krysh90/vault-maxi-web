import { CollateralToken, LoanToken } from '@defichain/whale-api-client/dist/api/loan'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createClient, getCollateralTokens, getLoanTokens } from '../api/whale-api'
import BigNumber from 'bignumber.js'

export type VaultTokenType = 'Collateral' | 'Loan'
export type VaultToken = CollateralToken | LoanToken
export type VaultTokenAmount = { token: VaultToken; amount: BigNumber }
export enum VaultScheme {
  V150 = '150', // 5
  V175 = '175', // 3
  V200 = '200', // 2
  V350 = '350', // 1.5
  V500 = '500', // 1
  V1000 = '1000', // 0.5
}

const schemeToInterest: Record<VaultScheme, number> = {
  [VaultScheme.V150]: 5,
  [VaultScheme.V175]: 3,
  [VaultScheme.V200]: 2,
  [VaultScheme.V350]: 1.5,
  [VaultScheme.V500]: 1,
  [VaultScheme.V1000]: 0.5,
}

interface VaultContextInterface {
  isLoading: boolean
  collateralTokens: CollateralToken[]
  loanTokens: LoanToken[]

  vaultCollateralTokens: VaultToken[]
  vaultLoanTokens: VaultToken[]

  resetVault: () => void
  setToken: (token: VaultToken, amount: BigNumber) => void

  collateralValue: BigNumber
  loanValue: BigNumber

  vaultScheme: VaultScheme
  setVaultScheme: (vaultScheme: VaultScheme) => void
  vaultInterest: number

  currentRatio: number
}

const VaultContext = createContext<VaultContextInterface>(undefined as any)

export function useVaultContext(): VaultContextInterface {
  return useContext(VaultContext)
}

export function VaultContextProvider(props: PropsWithChildren): JSX.Element {
  const [isLoading, setLoading] = useState(false)
  const [collateralTokens, setCollateralTokens] = useState<CollateralToken[]>([])
  const [loanTokens, setLoanTokens] = useState<LoanToken[]>([])
  const [vaultScheme, setVaultScheme] = useState<VaultScheme>(VaultScheme.V150)
  const [vaultCollateralTokens, setVaultCollateralTokens] = useState<Map<string, VaultTokenAmount>>(new Map())
  const [vaultLoanTokens, setVaultLoanTokens] = useState<Map<string, VaultTokenAmount>>(new Map())
  const dataFetchedRef = useRef(false)

  const client = createClient()

  useEffect(() => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    Promise.all([getCollateralTokens(client), getLoanTokens(client)]).then(([collateralTokens, loanTokens]) => {
      setCollateralTokens(collateralTokens.sort(byTokenSymbol))
      setLoanTokens(loanTokens.sort(byTokenSymbol))
      setLoading(false)
    })
  }, [client])

  function byTokenSymbol(a: VaultToken, b: VaultToken): number {
    return a.token.symbol.localeCompare(b.token.symbol)
  }

  function resetVault() {
    setVaultCollateralTokens(new Map())
    setVaultLoanTokens(new Map())
  }

  function setToken(token: VaultToken, amount: BigNumber) {
    'interest' in token
      ? setVaultLoanTokens(new Map(vaultLoanTokens.set(token.token.id, { token, amount })))
      : setVaultCollateralTokens(new Map(vaultCollateralTokens.set(token.token.id, { token, amount })))
  }

  const collateralValue = useMemo(
    () =>
      Array.from(vaultCollateralTokens.values())
        .map((value) => {
          return new BigNumber(value.token.activePrice?.active?.amount ?? '1')
            .multipliedBy('factor' in value.token ? value.token.factor : '1')
            .multipliedBy(value.amount)
        })
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0)),
    [vaultCollateralTokens],
  )

  const loanValue = useMemo(
    () =>
      Array.from(vaultLoanTokens.values())
        .map((value) => {
          return new BigNumber(value.token.activePrice?.active?.amount ?? '1')
            .multipliedBy('factor' in value.token ? value.token.factor : '1')
            .multipliedBy(value.amount)
        })
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0)),
    [vaultLoanTokens],
  )

  const context: VaultContextInterface = useMemo(
    () => ({
      isLoading,
      collateralTokens,
      loanTokens,
      vaultCollateralTokens: Array.from(vaultCollateralTokens.values()).map((value) => value.token),
      vaultLoanTokens: Array.from(vaultLoanTokens.values()).map((value) => value.token),
      setToken,
      resetVault,
      collateralValue,
      loanValue,
      vaultScheme,
      setVaultScheme,
      vaultInterest: schemeToInterest[vaultScheme],
      currentRatio: new BigNumber(collateralValue).dividedBy(loanValue).multipliedBy(100).decimalPlaces(2).toNumber(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isLoading,
      collateralTokens,
      loanTokens,
      vaultScheme,
      vaultCollateralTokens,
      vaultLoanTokens,
      collateralValue,
      loanValue,
    ],
  )

  return <VaultContext.Provider value={context}>{props.children}</VaultContext.Provider>
}
