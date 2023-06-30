import { CollateralToken, LoanToken } from '@defichain/whale-api-client/dist/api/loan'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createClient, getCollateralTokens, getLoanTokens, getVault } from '../api/whale-api'
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

  importVault: (vaultID: string) => Promise<void>
  resetVault: () => void
  setToken: (token: VaultToken, amount: BigNumber) => void
  removeToken: (token: VaultToken) => void
  getAmount: (token: VaultToken) => BigNumber

  collateralValue: BigNumber
  loanValue: BigNumber

  vaultScheme: VaultScheme
  setVaultScheme: (vaultScheme: VaultScheme) => void
  vaultInterest: number

  currentRatio: number
  nextRatio: number

  takeLoanRules: Map<string, boolean>
  withdrawCollateralRules: Map<string, boolean>
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

  async function importVault(vaultID: string): Promise<void> {
    resetVault()
    const vault = await getVault(client, vaultID)
    if (vault.state === 'ACTIVE') {
      const importedCollateralTokens = new Map<string, VaultTokenAmount>()
      for (var collateralToken of vault.collateralAmounts) {
        const token = collateralTokens.find((token) => token.token.id === collateralToken.id)
        if (token)
          importedCollateralTokens.set(token.token.id, { token, amount: new BigNumber(collateralToken.amount) })
      }
      setVaultCollateralTokens(importedCollateralTokens)

      const importedLoanTokens = new Map<string, VaultTokenAmount>()
      for (var loanToken of vault.loanAmounts) {
        const token = loanTokens.find((token) => token.token.id === loanToken.id)
        if (token) importedLoanTokens.set(token.token.id, { token, amount: new BigNumber(loanToken.amount) })
      }
      setVaultLoanTokens(importedLoanTokens)
    }
  }

  function resetVault() {
    setVaultCollateralTokens(new Map())
    setVaultLoanTokens(new Map())
  }

  function getAmount(token: VaultToken): BigNumber {
    return (
      ('interest' in token
        ? vaultLoanTokens.get(token.token.id)?.amount
        : vaultCollateralTokens.get(token.token.id)?.amount) ?? new BigNumber(1)
    )
  }

  function removeToken(token: VaultToken) {
    if ('interest' in token) {
      vaultLoanTokens.delete(token.token.id)
      setVaultLoanTokens(new Map(vaultLoanTokens))
    } else {
      vaultCollateralTokens.delete(token.token.id)
      setVaultCollateralTokens(new Map(vaultCollateralTokens))
    }
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

  const nextCollateralValue = useMemo(
    () =>
      Array.from(vaultCollateralTokens.values())
        .map((value) => {
          return new BigNumber(value.token.activePrice?.next?.amount ?? '1')
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

  const nextLoanValue = useMemo(
    () =>
      Array.from(vaultLoanTokens.values())
        .map((value) => {
          return new BigNumber(value.token.activePrice?.next?.amount ?? '1')
            .multipliedBy('factor' in value.token ? value.token.factor : '1')
            .multipliedBy(value.amount)
        })
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0)),
    [vaultLoanTokens],
  )

  const unlocksDUSDLoansViaDFI = useMemo(() => {
    const collateralDFI = collateralTokens.find((token) => token.token.symbol === 'DFI')
    if (!collateralDFI) return false
    return (
      vaultCollateralTokens
        .get(collateralDFI.token.id)
        ?.amount.multipliedBy(collateralDFI.activePrice?.active?.amount ?? '1')
        .isGreaterThan(loanValue.multipliedBy(Number(vaultScheme) / 100).dividedBy(2)) ?? false
    )
  }, [collateralTokens, vaultCollateralTokens, loanValue, vaultScheme])

  // const unlocksAllLoansViaDUSD = useMemo(() => {
  //   const collateralDUSD = collateralTokens.find((token) => token.token.symbol === 'DUSD')
  //   return vaultCollateralTokens.size === 1 && vaultCollateralTokens.has(collateralDUSD?.token.id ?? '')
  // }, [collateralTokens, vaultCollateralTokens])

  const unlocksDTokenLoans = useMemo(() => {
    const collateralDFI = collateralTokens.find((token) => token.token.symbol === 'DFI')
    const collateralDUSD = collateralTokens.find((token) => token.token.symbol === 'DUSD')
    if (!collateralDFI || !collateralDUSD) return false
    const combinedCollateralValue = (
      vaultCollateralTokens
        .get(collateralDFI.token.id)
        ?.amount.multipliedBy(collateralDFI.activePrice?.active?.amount ?? '1') ?? new BigNumber(0)
    ).plus(
      vaultCollateralTokens
        .get(collateralDUSD.token.id)
        ?.amount.multipliedBy(collateralDUSD.activePrice?.active?.amount ?? '1') ?? '0',
    )
    return (
      combinedCollateralValue?.isGreaterThan(loanValue.multipliedBy(Number(vaultScheme) / 100).dividedBy(2)) ?? false
    )
  }, [collateralTokens, vaultCollateralTokens, loanValue, vaultScheme])

  const takeLoanRules: Map<string, boolean> = new Map([
    ['DUSD loans: minimum 50% DFI', unlocksDUSDLoansViaDFI],
    //['DUSD loans: 100% DUSD', unlocksAllLoansViaDUSD], only enable if gov variable is set
    ['dToken loans: minimum 50% DFI or DUSD', unlocksDTokenLoans],
  ])

  const hasDUSDLoansAndHalfDFICollateral = useMemo(() => {
    const collateralDFI = collateralTokens.find((token) => token.token.symbol === 'DFI')
    const loanDUSD = loanTokens.find((token) => token.token.symbol === 'DUSD')
    if (!collateralDFI || !loanDUSD) return false
    return (
      (vaultCollateralTokens
        .get(collateralDFI.token.id)
        ?.amount.multipliedBy(collateralDFI.activePrice?.active?.amount ?? '1')
        .isGreaterThan(loanValue.multipliedBy(Number(vaultScheme) / 100).dividedBy(2)) &&
        vaultLoanTokens.has(loanDUSD?.token.id)) ??
      false
    )
  }, [collateralTokens, vaultCollateralTokens, loanTokens, vaultLoanTokens, loanValue, vaultScheme])

  const hasHalfCombinedCollateralValue = useMemo(() => {
    const collateralDFI = collateralTokens.find((token) => token.token.symbol === 'DFI')
    const collateralDUSD = collateralTokens.find((token) => token.token.symbol === 'DUSD')
    const loanDUSD = loanTokens.find((token) => token.token.symbol === 'DUSD')
    if (!collateralDFI || !collateralDUSD || !loanDUSD) return false
    const combinedCollateralValue = (
      vaultCollateralTokens
        .get(collateralDFI.token.id)
        ?.amount.multipliedBy(collateralDFI.activePrice?.active?.amount ?? '1') ?? new BigNumber(0)
    ).plus(
      vaultCollateralTokens
        .get(collateralDUSD.token.id)
        ?.amount.multipliedBy(collateralDUSD.activePrice?.active?.amount ?? '1') ?? '0',
    )
    return (
      (combinedCollateralValue?.isGreaterThan(loanValue.multipliedBy(Number(vaultScheme) / 100).dividedBy(2)) &&
        !vaultLoanTokens.has(loanDUSD?.token.id)) ??
      false
    )
  }, [collateralTokens, vaultCollateralTokens, loanTokens, vaultLoanTokens, loanValue, vaultScheme])

  const withdrawCollateralRules: Map<string, boolean> = new Map([
    ['only dToken loans: minimum 50% DFI or DUSD collateral', hasHalfCombinedCollateralValue],
    ['has DUSD loans: minimum 50% DFI collateral', hasDUSDLoansAndHalfDFICollateral],
  ])

  const context: VaultContextInterface = useMemo(
    () => ({
      isLoading,
      collateralTokens,
      loanTokens,
      vaultCollateralTokens: Array.from(vaultCollateralTokens.values()).map((value) => value.token),
      vaultLoanTokens: Array.from(vaultLoanTokens.values()).map((value) => value.token),
      setToken,
      removeToken,
      getAmount,
      importVault,
      resetVault,
      collateralValue,
      loanValue,
      vaultScheme,
      setVaultScheme,
      vaultInterest: schemeToInterest[vaultScheme],
      currentRatio: new BigNumber(collateralValue).dividedBy(loanValue).multipliedBy(100).decimalPlaces(2).toNumber(),
      nextRatio: new BigNumber(nextCollateralValue)
        .dividedBy(nextLoanValue)
        .multipliedBy(100)
        .decimalPlaces(2)
        .toNumber(),
      takeLoanRules,
      withdrawCollateralRules,
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
