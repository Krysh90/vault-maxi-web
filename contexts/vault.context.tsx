import { CollateralToken, LoanToken } from '@defichain/whale-api-client/dist/api/loan'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createClient, getCollateralTokens, getLoanTokens, getVault } from '../api/whale-api'
import BigNumber from 'bignumber.js'
import { TokenData } from '@defichain/whale-api-client/dist/api/tokens'

export type VaultTokenType = 'Collateral' | 'Loan'
export type VaultToken = CollateralToken | LoanToken
export type VaultTokenAmount = { token: VaultToken; amount: BigNumber }
export type VaultTokenPrice = TokenData & { price?: string; nextPrice?: string }
export interface CustomPriceEntry {
  id: number
  token: VaultTokenPrice
  value: number
}
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
  collateralValueWithoutStables: BigNumber
  loanValue: BigNumber
  loanValueWithoutNegativeInterests: BigNumber

  vaultScheme: VaultScheme
  setVaultScheme: (vaultScheme: VaultScheme) => void
  vaultInterest: number

  currentRatio: number
  nextRatio?: number

  takeLoanRules: Map<string, boolean>
  withdrawCollateralRules: Map<string, boolean>

  priceTokens: VaultTokenPrice[]
  customizedPrices: CustomPriceEntry[]
  addCustomPrice: () => void
  updateCustomPrice: (id: number, values: Partial<CustomPriceEntry>) => void
  removeCustomPrice: (index: number) => void

  getPriceOfToken: (token: VaultToken) => string
  hasCustomPrice: (token: VaultToken) => boolean
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
  const [entries, setEntries] = useState<CustomPriceEntry[]>([])
  const dataFetchedRef = useRef(false)

  const stables = useMemo(() => ['DUSD', 'USDC', 'USDT', 'EUROC', 'XCHF'], [])

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
    if (vaultID.length !== 64) return
    resetVault()
    setLoading(true)
    const vault = await getVault(client, vaultID)
    if (vault.state === 'ACTIVE') {
      setVaultScheme(vault.loanScheme.minColRatio as VaultScheme)

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
    setLoading(false)
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
          return new BigNumber(getPriceOfToken(value.token))
            .multipliedBy('factor' in value.token ? value.token.factor : '1')
            .multipliedBy(value.amount)
        })
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0)),
    [vaultCollateralTokens, getPriceOfToken],
  )

  const collateralValueWithoutStables = useMemo(
    () =>
      Array.from(vaultCollateralTokens.values())
        .filter((v) => !stables.includes(v.token.token.symbol))
        .map((value) => {
          return new BigNumber(getPriceOfToken(value.token))
            .multipliedBy('factor' in value.token ? value.token.factor : '1')
            .multipliedBy(value.amount)
        })
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0)),
    [vaultCollateralTokens, getPriceOfToken, stables],
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
          return new BigNumber(getPriceOfToken(value.token))
            .multipliedBy('factor' in value.token ? value.token.factor : '1')
            .multipliedBy(value.amount)
        })
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0)),
    [vaultLoanTokens, getPriceOfToken],
  )

  const loanValueWithoutNegativeInterests = useMemo(
    () =>
      Array.from(vaultLoanTokens.values())
        .filter((v) =>
          'interest' in v.token
            ? new BigNumber(v.token.interest).plus(schemeToInterest[vaultScheme]).isGreaterThanOrEqualTo(0)
            : false,
        )
        .map((value) => {
          return new BigNumber(getPriceOfToken(value.token))
            .multipliedBy('factor' in value.token ? value.token.factor : '1')
            .multipliedBy(value.amount)
        })
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0)),
    [vaultLoanTokens, getPriceOfToken, vaultScheme],
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
        ?.amount.multipliedBy(getPriceOfToken(collateralDFI))
        .isGreaterThan(loanValue.multipliedBy(Number(vaultScheme) / 100).dividedBy(2)) ?? false
    )
  }, [collateralTokens, vaultCollateralTokens, loanValue, vaultScheme, getPriceOfToken])

  // const unlocksAllLoansViaDUSD = useMemo(() => {
  //   const collateralDUSD = collateralTokens.find((token) => token.token.symbol === 'DUSD')
  //   return vaultCollateralTokens.size === 1 && vaultCollateralTokens.has(collateralDUSD?.token.id ?? '')
  // }, [collateralTokens, vaultCollateralTokens])

  const unlocksDTokenLoans = useMemo(() => {
    const collateralDFI = collateralTokens.find((token) => token.token.symbol === 'DFI')
    const collateralDUSD = collateralTokens.find((token) => token.token.symbol === 'DUSD')
    if (!collateralDFI || !collateralDUSD) return false
    const combinedCollateralValue = (
      vaultCollateralTokens.get(collateralDFI.token.id)?.amount.multipliedBy(getPriceOfToken(collateralDFI)) ??
      new BigNumber(0)
    ).plus(
      vaultCollateralTokens.get(collateralDUSD.token.id)?.amount.multipliedBy(getPriceOfToken(collateralDUSD)) ?? '0',
    )
    return (
      combinedCollateralValue?.isGreaterThan(loanValue.multipliedBy(Number(vaultScheme) / 100).dividedBy(2)) ?? false
    )
  }, [collateralTokens, vaultCollateralTokens, loanValue, vaultScheme, getPriceOfToken])

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
        ?.amount.multipliedBy(getPriceOfToken(collateralDFI))
        .isGreaterThan(loanValue.multipliedBy(Number(vaultScheme) / 100).dividedBy(2)) &&
        vaultLoanTokens.has(loanDUSD?.token.id)) ??
      false
    )
  }, [collateralTokens, vaultCollateralTokens, loanTokens, vaultLoanTokens, loanValue, vaultScheme, getPriceOfToken])

  const hasHalfCombinedCollateralValue = useMemo(() => {
    const collateralDFI = collateralTokens.find((token) => token.token.symbol === 'DFI')
    const collateralDUSD = collateralTokens.find((token) => token.token.symbol === 'DUSD')
    const loanDUSD = loanTokens.find((token) => token.token.symbol === 'DUSD')
    if (!collateralDFI || !collateralDUSD || !loanDUSD) return false
    const combinedCollateralValue = (
      vaultCollateralTokens.get(collateralDFI.token.id)?.amount.multipliedBy(getPriceOfToken(collateralDFI)) ??
      new BigNumber(0)
    ).plus(
      vaultCollateralTokens.get(collateralDUSD.token.id)?.amount.multipliedBy(getPriceOfToken(collateralDUSD)) ?? '0',
    )
    return (
      (combinedCollateralValue?.isGreaterThan(loanValue.multipliedBy(Number(vaultScheme) / 100).dividedBy(2)) &&
        !vaultLoanTokens.has(loanDUSD?.token.id)) ??
      false
    )
  }, [collateralTokens, vaultCollateralTokens, loanTokens, vaultLoanTokens, loanValue, vaultScheme, getPriceOfToken])

  const withdrawCollateralRules: Map<string, boolean> = new Map([
    ['only dToken loans: minimum 50% DFI or DUSD collateral', hasHalfCombinedCollateralValue],
    ['has DUSD loans: minimum 50% DFI collateral', hasDUSDLoansAndHalfDFICollateral],
  ])

  const priceTokens = collateralTokens
    .filter((token) => !stables.includes(token.token.symbol))
    .map((token) => ({ ...token.token, price: token.activePrice?.active?.amount }))
    .concat(
      loanTokens
        .filter((token) => !stables.includes(token.token.symbol))
        .map((token) => ({ ...token.token, price: token.activePrice?.active?.amount })),
    )

  function formatPrice(price?: string): number {
    return new BigNumber(price ?? 1).decimalPlaces(2).toNumber()
  }

  function addCustomPrice() {
    const token = priceTokens[entries.length]
    if (!token) return
    entries.push({ id: entries.length, token, value: formatPrice(token.price) })
    setEntries(Array.from(entries))
  }

  function updateCustomPrice(id: number, values: Partial<CustomPriceEntry>) {
    const entry = entries[id]
    if (values.token) {
      entry.token = values.token
      entry.value = formatPrice(priceTokens.find((token) => token.id === values.token?.id)?.price)
    }
    if (values.value) {
      entry.value = values.value
    }
    setEntries(Array.from(entries))
  }

  function removeCustomPrice(index: number) {
    entries.splice(index, 1)
    setEntries(Array.from(entries))
  }

  function getPriceOfToken(token: VaultToken): string {
    const customPrice = entries.find((e) => e.token.id === token.token.id)
    return customPrice ? '' + formatPrice('' + customPrice.value) : token.activePrice?.active?.amount ?? '1'
  }

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
      collateralValueWithoutStables,
      loanValue,
      loanValueWithoutNegativeInterests,
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
      priceTokens,
      customizedPrices: entries,
      addCustomPrice,
      updateCustomPrice,
      removeCustomPrice,
      getPriceOfToken,
      hasCustomPrice: (token: VaultToken) => entries.find((e) => token.token.id === e.token.id) !== undefined,
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
      collateralValueWithoutStables,
      loanValue,
      loanValueWithoutNegativeInterests,
      priceTokens,
      entries,
    ],
  )

  return <VaultContext.Provider value={context}>{props.children}</VaultContext.Provider>
}
