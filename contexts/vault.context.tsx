import { CollateralToken, LoanToken } from '@defichain/whale-api-client/dist/api/loan'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createClient, getCollateralTokens, getLoanTokens } from '../api/whale-api'

export type VaultTokenType = 'Collateral' | 'Loan'
export type VaultToken = CollateralToken | LoanToken

interface VaultContextInterface {
  isLoading: boolean
  collateralTokens: CollateralToken[]
  loanTokens: LoanToken[]

  vaultCollateralTokens: VaultToken[]
  vaultLoanTokens: VaultToken[]

  resetVault: () => void
  addTokenToVault: (token: VaultToken) => void
}

const VaultContext = createContext<VaultContextInterface>(undefined as any)

export function useVaultContext(): VaultContextInterface {
  return useContext(VaultContext)
}

export function VaultContextProvider(props: PropsWithChildren): JSX.Element {
  const [isLoading, setLoading] = useState(false)
  const [collateralTokens, setCollateralTokens] = useState<CollateralToken[]>([])
  const [loanTokens, setLoanTokens] = useState<LoanToken[]>([])
  const [vaultCollateralTokens, setVaultCollateralTokens] = useState<VaultToken[]>([])
  const [vaultLoanTokens, setVaultLoanTokens] = useState<VaultToken[]>([])
  const dataFetchedRef = useRef(false)

  const client = createClient()

  useEffect(() => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    Promise.all([getCollateralTokens(client), getLoanTokens(client)]).then(([collateralTokens, loanTokens]) => {
      setCollateralTokens(collateralTokens)
      setLoanTokens(loanTokens)
      setLoading(false)
    })
  }, [client])

  function resetVault() {
    setVaultCollateralTokens([])
    setVaultLoanTokens([])
  }

  function addTokenToVault(token: VaultToken) {
    'interest' in token
      ? setVaultLoanTokens(addOnce(vaultLoanTokens, token))
      : setVaultCollateralTokens(addOnce(vaultCollateralTokens, token))
  }

  function addOnce(array: VaultToken[], element: VaultToken): VaultToken[] {
    return array.find((value) => value.tokenId === element.tokenId) ? array : array.concat(element)
  }

  const context: VaultContextInterface = useMemo(
    () => ({
      isLoading,
      collateralTokens,
      loanTokens,
      vaultCollateralTokens,
      vaultLoanTokens,
      addTokenToVault,
      resetVault,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, collateralTokens, loanTokens, vaultCollateralTokens, vaultLoanTokens],
  )

  return <VaultContext.Provider value={context}>{props.children}</VaultContext.Provider>
}
