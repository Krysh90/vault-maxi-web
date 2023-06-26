import { VaultToken, VaultTokenType, useVaultContext } from '../contexts/vault.context'

interface VaultSim {
  encode: (type: VaultTokenType, id: string) => string
  decode: (data: string) => VaultToken | undefined
}

export function useVaultSim(): VaultSim {
  const { collateralTokens, loanTokens } = useVaultContext()

  function encode(type: VaultTokenType, id: string): string {
    return `${type}|${id}`
  }

  function decode(data: string): VaultToken | undefined {
    const dataSplit = data.split('|')
    const haystack: VaultToken[] = dataSplit[0] === 'Collateral' ? collateralTokens : loanTokens
    return haystack.find((token: VaultToken) => token.tokenId === dataSplit[1])
  }

  return { encode, decode }
}
